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
using Transfers.Identity;
using Transfers.Models;

namespace Transfers.Controllers {

    [Route("api/[controller]")]

    public class TokenController : ControllerBase {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppSettings _appSettings;
        private readonly Token _token;
        private readonly ApplicationDbContext _db;

        public TokenController(UserManager<ApplicationUser> userManager, IOptions<AppSettings> appSettings, Token token, ApplicationDbContext db) {
            _userManager = userManager;
            _appSettings = appSettings.Value;
            _token = token;
            _db = db;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Auth([FromBody] TokenRequest model) {
            if (model == null) { return new StatusCodeResult(500); }
            switch (model.GrantType) {
                case "password":
                    return await GenerateNewToken(model);
                case "refresh_token":
                    return await RefreshToken(model);
                default:
                    return new UnauthorizedResult();
            }
        }

        private async Task<IActionResult> GenerateNewToken(TokenRequest model) {

            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password)) {

                if (!await _userManager.IsEmailConfirmedAsync(user)) {

                    ModelState.AddModelError("", "User has not confirmed email");

                    return Unauthorized(new { LoginError = "We sent you an Confirmation Email. Please Confirm Your Registration With Techhowdy.com To Log in." });

                }

                var newRefreshToken = CreateRefreshToken(_appSettings.ClientId, user.Id);
                var oldRefreshTokens = _db.Tokens.Where(rt => rt.UserId == user.Id);

                if (oldRefreshTokens != null) {
                    foreach (var token in oldRefreshTokens) {
                        _db.Tokens.Remove(token);
                    }
                }

                _db.Tokens.Add(newRefreshToken);

                await _db.SaveChangesAsync();

                var accessToken = await CreateAccessToken(user, newRefreshToken.Value);

                return Ok(new { authToken = accessToken });

            }

            ModelState.AddModelError("", "Username/Password was not Found");

            return Unauthorized(new { LoginError = "Invalid credentials" });

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
            double tokenExpiryTime = Convert.ToDouble(_appSettings.ExpireTime);
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Secret));
            var roles = await _userManager.GetRolesAsync(user);
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
                Issuer = _appSettings.Site,
                Audience = _appSettings.Audience,
                Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
            };
            var newtoken = tokenHandler.CreateToken(tokenDescriptor);
            var encodedToken = tokenHandler.WriteToken(newtoken);
            return new TokenResponse() {
                token = encodedToken,
                    expiration = newtoken.ValidTo,
                    refresh_token = refreshToken,
                    username = user.UserName,
                    displayName = user.DisplayName
            };
        }

        private async Task<IActionResult> RefreshToken(TokenRequest model) {
            try {
                var rt = _db.Tokens.FirstOrDefault(t => t.ClientId == _appSettings.ClientId && t.Value == model.RefreshToken.ToString());
                if (rt == null) return new UnauthorizedResult();
                if (rt.ExpiryTime < DateTime.UtcNow) return new UnauthorizedResult();
                var user = await _userManager.FindByIdAsync(rt.UserId);
                if (user == null) return new UnauthorizedResult();
                var rtNew = CreateRefreshToken(rt.ClientId, rt.UserId);
                _db.Tokens.Remove(rt);
                _db.Tokens.Add(rtNew);
                _db.SaveChanges();
                var response = await CreateAccessToken(user, rtNew.Value);
                return Ok(new { authToken = response });
            } catch {
                return new UnauthorizedResult();
            }
        }

    }
}