using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Transfers.Identity;
using Transfers.Models;

namespace Transfers {

    [Route("api/[controller]")]

    public class AccountController : Controller {

        // Variables
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ILogger<AccountController> logger;
        private readonly AppSettings appSettings;
        private readonly TokenModel token;
        private readonly ApplicationDbContext db;

        // Constructor
        public AccountController(UserManager<ApplicationUser> userManager, IOptions<AppSettings> appSettings, TokenModel token, ApplicationDbContext db, ILogger<AccountController> logger) {
            this.userManager = userManager;
            this.logger = logger;
            this.appSettings = appSettings.Value;
            this.token = token;
            this.db = db;
        }

        // api/account/login
        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] TokenRequestModel model) {
            if (model == null) return BadRequest();
            switch (model.GrantType) {
                case "password":
                    return await GenerateNewToken(model);
                case "refresh_token":
                    return await RefreshToken(model);
                default:
                    return new UnauthorizedResult();
            }
        }

        private async Task<IActionResult> GenerateNewToken(TokenRequestModel model) {
            var user = await userManager.FindByNameAsync(model.UserName);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password)) {
                var newRtoken = CreateRefreshToken(appSettings.ClientId, user.Id);
                var oldrTokens = db.Tokens.Where(rt => rt.UserId == user.Id);
                if (oldrTokens != null) {
                    foreach (var oldrt in oldrTokens) {
                        db.Tokens.Remove(oldrt);
                    }
                }
                db.Tokens.Add(newRtoken);
                await db.SaveChangesAsync();
                var accessToken = await CreateAccessToken(user, newRtoken.Value);
                return Ok(new { authToken = accessToken });
            }
            ModelState.AddModelError("", "Username/Password was not Found");
            return Unauthorized(new { LoginError = "Invalid credentials" });
        }

        private async Task<TokenResponseModel> CreateAccessToken(ApplicationUser user, string refreshToken) {
            double tokenExpiryTime = Convert.ToDouble(appSettings.ExpireTime);
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(appSettings.Secret));
            var roles = await userManager.GetRolesAsync(user);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim("LoggedOn", DateTime.Now.ToString()),
                }),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                Issuer = appSettings.Site,
                Audience = appSettings.Audience,
                Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
            };
            var newtoken = tokenHandler.CreateToken(tokenDescriptor);
            var encodedToken = tokenHandler.WriteToken(newtoken);
            return new TokenResponseModel() {
                token = encodedToken,
                    expiration = newtoken.ValidTo,
                    refresh_token = refreshToken,
                    roles = roles.FirstOrDefault(),
                    userName = user.UserName,
                    displayName = user.DisplayName
            };
        }

        private TokenModel CreateRefreshToken(string clientId, string userId) {
            return new TokenModel() {
                ClientId = clientId,
                    UserId = userId,
                    Value = Guid.NewGuid().ToString("N"),
                    CreatedDate = DateTime.UtcNow,
                    ExpiryTime = DateTime.UtcNow.AddMinutes(90)
            };
        }

        private async Task<IActionResult> RefreshToken(TokenRequestModel model) {
            try {
                var rt = db.Tokens.FirstOrDefault(t => t.ClientId == appSettings.ClientId && t.Value == model.RefreshToken.ToString());
                if (rt == null) return new UnauthorizedResult();
                if (rt.ExpiryTime < DateTime.UtcNow) return new UnauthorizedResult();
                var user = await userManager.FindByIdAsync(rt.UserId);
                if (user == null) return new UnauthorizedResult();
                var rtNew = CreateRefreshToken(rt.ClientId, rt.UserId);
                db.Tokens.Remove(rt);
                db.Tokens.Add(rtNew);
                db.SaveChanges();
                var response = await CreateAccessToken(user, rtNew.Value);
                return Ok(new { authToken = response });
            } catch {
                return new UnauthorizedResult();
            }
        }

        // api/account/forgotPassword
        [HttpPost("[action]")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassword model) {
            if (ModelState.IsValid) {
                var user = await userManager.FindByEmailAsync(model.Email);
                if (user != null && await userManager.IsEmailConfirmedAsync(user)) {
                    string token = await userManager.GeneratePasswordResetTokenAsync(user);
                    string passwordResetLink = Url.Action("ResetPassword", "Account", new { email = model.Email, token }, Request.Scheme);
                    logger.Log(LogLevel.Information, passwordResetLink);
                    return Ok(passwordResetLink);
                }
            }
            return BadRequest();
        }

    }

}