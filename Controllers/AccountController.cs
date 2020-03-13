using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
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

    public class UserIdToken {
        public string UserId { get; set; }
        public string Token { get; set; }
    }

    [Route("api/[controller]")]

    public class AccountController : Controller {

        // Variables
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ILogger<AccountController> logger;
        private readonly AppSettings appSettings;
        private readonly TokenModel token;
        private readonly ApplicationDbContext db;
        private readonly EmailSettings emailSettings;

        // Constructor
        public AccountController(UserManager<ApplicationUser> userManager, IOptions<AppSettings> appSettings, TokenModel token, ApplicationDbContext db, IOptions<EmailSettings> emailSettings) {
            this.userManager = userManager;
            this.appSettings = appSettings.Value;
            this.token = token;
            this.db = db;
            this.emailSettings = emailSettings.Value;
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

        // api/account/forgetPassword
        [HttpPost("[action]")]
        public async Task<IActionResult> ForgetPassword([FromBody] ResetPassword model) {

            if (ModelState.IsValid) {

                var user = await userManager.FindByEmailAsync(model.Email);

                if (user != null && await userManager.IsEmailConfirmedAsync(user)) {

                    await SendResetPasswordEmail(user, model);

                    return Ok();

                }

                return Ok();

            }

            return BadRequest();

        }

        // api/account/confirmEmail/userId/token
        [HttpGet("[action]")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token) {

            var user = await userManager.FindByIdAsync(userId);
            var result = await userManager.ConfirmEmailAsync(user, token);

            if (result.Succeeded) {
                return Ok();
            }

            return BadRequest();

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

        private async Task<IActionResult> SendResetPasswordEmail(ApplicationUser user, ResetPassword model) {

            string token = await userManager.GeneratePasswordResetTokenAsync(user);
            string passwordResetLink = Url.Action("ResetPassword", "Account", new { email = model.Email, token }, Request.Scheme);

            using(MailMessage mail = new MailMessage()) {
                mail.From = new MailAddress(emailSettings.From);
                mail.To.Add(user.Email);
                mail.Subject = "Complete your password reset";
                mail.Body = "<h1 style='color: #008080;'>Hello, " + user.DisplayName + "</h1>";
                mail.Body += "<h2 style='color: #2e6c80;'>It seems you suffer from memory loss!</h2>";
                mail.Body += "<p>Click the following button to reset your password.</p>";
                mail.Body += "<a style='margin: 1rem 0; background-color: #5e9ca0; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;' href=" + passwordResetLink + ">Confirm email</a>";
                mail.Body += "<p>If clicking doesn't work, copy and paste this link:</p>";
                mail.Body += "<p>" + passwordResetLink + "</p>";
                mail.Body += "<p style='font-size: 11px; margin: 2rem 0;'>&copy; People Movers " + DateTime.Now.ToString("yyyy") + "</p>";
                mail.IsBodyHtml = true;
                using(SmtpClient smtp = new SmtpClient(emailSettings.SmtpClient, emailSettings.Port)) {
                    smtp.UseDefaultCredentials = true;
                    smtp.Credentials = new NetworkCredential(emailSettings.Username, emailSettings.Password);
                    smtp.EnableSsl = true;
                    smtp.Send(mail);
                }
            }

            return Ok();

        }

    }

}