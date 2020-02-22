using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Transfers.Identity;
using Transfers.Models;

namespace Transfers.Controllers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]

    public class AccountController : Controller {

        // Variables 
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signManager;
        private readonly EmailSettings emailSettings;

        // Constructor
        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IOptions<EmailSettings> emailSettings) {

            this.userManager = userManager;
            this.signManager = signInManager;
            this.emailSettings = emailSettings.Value;

        }

        // POST: api/account/register
        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel formdata) {

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = new ApplicationUser { Email = formdata.Email, UserName = formdata.UserName, DisplayName = formdata.DisplayName, SecurityStamp = Guid.NewGuid().ToString() };
            var result = await userManager.CreateAsync(user, formdata.Password);

            if (result.Succeeded) {
                await addUserToRole(user);
                // await sendConfirmationEmail(user);
                return Ok();
            } else {
                return StatusCode(409);
            }

        }

        private async Task<IActionResult> addUserToRole(ApplicationUser user) {

            var result = await userManager.AddToRoleAsync(user, "User");

            return Ok();

        }

        private async Task<IActionResult> sendConfirmationEmail(ApplicationUser user) {

            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = Url.Action("ConfirmEmail", "Identity", new { userId = user.Id, token = token }, Request.Scheme);

            using(MailMessage mail = new MailMessage()) {
                mail.From = new MailAddress(emailSettings.From);
                mail.To.Add(user.Email);
                mail.Subject = "Complete your account setup";
                mail.Body = "<h1 style='color: #008080;'>Hello, " + user.DisplayName + "</h1>";
                mail.Body += "<h2 style='color: #2e6c80;'>Welcome to our group of users!</h2>";
                mail.Body += "<p>Click the following button to confirm your email account.</p>";
                mail.Body += "<a style='margin: 1rem 0; background-color: #5e9ca0; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;' href=" + confirmationLink + ">Confirm email</a>";
                mail.Body += "<p>If clicking doesn't work, copy and paste this link:</p>";
                mail.Body += "<p>" + confirmationLink + "</p>";
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