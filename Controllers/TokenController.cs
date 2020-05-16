using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Transfers {

    [Route("api/[controller]")]
    public class TokenController : ControllerBase {

        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly AppSettings appSettings;
        private readonly Token token;
        private readonly AppDbContext db;

        public TokenController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IOptions<AppSettings> appSettings, Token token, AppDbContext db) =>
            (this.userManager, this.signInManager, this.appSettings, this.token, this.db) = (userManager, signInManager, appSettings.Value, token, db);

        [HttpPost("[action]")]
        public async Task<IActionResult> Auth([FromBody] TokenRequest model) {
            switch (model.GrantType) {
                case "password":
                    return await GenerateNewToken(model);
                case "refresh_token":
                    return await RefreshToken(model);
                default:
                    return Unauthorized(new { response = ApiMessages.AuthenticationFailed() });
            }
        }

        private async Task<IActionResult> GenerateNewToken(TokenRequest model) {
            var user = await userManager.FindByNameAsync(model.Username);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password)) {
                if (!await userManager.IsEmailConfirmedAsync(user)) {
                    return BadRequest(new { response = ApiMessages.AccountNotConfirmed() });
                }
                var newRefreshToken = CreateRefreshToken(appSettings.ClientId, user.Id);
                var oldRefreshTokens = db.Tokens.Where(rt => rt.UserId == user.Id);
                if (oldRefreshTokens != null) {
                    foreach (var token in oldRefreshTokens) {
                        db.Tokens.Remove(token);
                    }
                }
                db.Tokens.Add(newRefreshToken);
                await db.SaveChangesAsync();
                var accessToken = await CreateAccessToken(user, newRefreshToken.Value);
                return Ok(new { response = accessToken });
            }
            return Unauthorized(new { response = ApiMessages.AuthenticationFailed() });
        }

        private Token CreateRefreshToken(string clientId, string userId) {
            return new Token() {
                ClientId = clientId,
                    UserId = userId,
                    Value = Guid.NewGuid().ToString("N"),
                    CreatedDate = DateTime.UtcNow,
                    ExpiryTime = DateTime.UtcNow.AddMinutes(90)
            };
        }

        private async Task<TokenResponse> CreateAccessToken(ApplicationUser user, string refreshToken) {
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
            return new TokenResponse() {
                token = encodedToken,
                    expiration = newtoken.ValidTo,
                    refresh_token = refreshToken,
                    roles = roles.FirstOrDefault(),
                    userId = user.Id,
                    displayName = user.DisplayName
            };
        }

        private async Task<IActionResult> RefreshToken(TokenRequest model) {
            try {
                var rt = db.Tokens.FirstOrDefault(t => t.ClientId == appSettings.ClientId && t.Value == model.RefreshToken.ToString());
                if (rt == null) return new UnauthorizedResult();
                if (rt.ExpiryTime < DateTime.UtcNow) return Unauthorized(new { response = ApiMessages.AuthenticationFailed() });
                var user = await userManager.FindByIdAsync(rt.UserId);
                if (user == null) return Unauthorized(new { response = ApiMessages.AuthenticationFailed() });
                var rtNew = CreateRefreshToken(rt.ClientId, rt.UserId);
                db.Tokens.Remove(rt);
                db.Tokens.Add(rtNew);
                db.SaveChanges();
                var token = await CreateAccessToken(user, rtNew.Value);
                return Ok(new { response = token });
            } catch {
                return Unauthorized(new { response = ApiMessages.AuthenticationFailed() });
            }
        }

    }

}