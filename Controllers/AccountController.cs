using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Transfers.Email;
using Transfers.Identity;
using Transfers.Models;

namespace Transfers {

    [Route("api/[controller]")]

    public class AccountController : Controller {

        private readonly AppSettings appSettings;
        private readonly IEmailSender emailSender;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly UserManager<ApplicationUser> userManager;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailSender emailSender, IOptions<AppSettings> appSettings) {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.appSettings = appSettings.Value;
            this.emailSender = emailSender;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel formData) {

            List<string> errorList = new List<string>();

            var user = new ApplicationUser {
                Email = formData.Email,
                UserName = formData.UserName,
                DisplayName = formData.DisplayName,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await userManager.CreateAsync(user, formData.Password);

            if (result.Succeeded) {

                await userManager.AddToRoleAsync(user, "User");
                var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var callbackUrl = Url.Action("ConfirmEmail", "Account", new { UserId = user.Id, Code = code }, protocol : HttpContext.Request.Scheme);
                emailSender.SendRegistrationEmail(user.Email, user.UserName, callbackUrl);
                return Ok(new { message = "Registration Successful, confirm your email address" });

            }

            foreach (var error in result.Errors) {
                ModelState.AddModelError("", error.Description);
                errorList.Add(error.Description);
            }

            return BadRequest(new JsonResult(errorList));

        }

        [HttpGet("[action]")]
        public async Task<IActionResult> ConfirmEmail(string userId, string code) {

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code)) {
                ModelState.AddModelError("", "User Id and code are required");
                return BadRequest(ModelState);
            }

            var user = await userManager.FindByIdAsync(userId);

            if (user == null) { return new JsonResult("Error"); }
            if (user.EmailConfirmed) { return Redirect("/login"); }

            var result = await userManager.ConfirmEmailAsync(user, code);

            if (result.Succeeded) {

                return RedirectToAction("EmailConfirmation", "Notifications", new { userId, code });

            } else {

                List<string> errors = new List<string>();

                foreach (var error in result.Errors) {
                    errors.Add(error.ToString());
                }

                return new JsonResult(errors);

            }

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassword model) {

            if (ModelState.IsValid) {

                var user = await userManager.FindByEmailAsync(model.Email);

                if (user != null && await userManager.IsEmailConfirmedAsync(user)) {

                    string token = await userManager.GeneratePasswordResetTokenAsync(user);
                    string tokenEncoded = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
                    string baseUrl = $"{this.Request.Scheme}://{this.Request.Host.Value.ToString()}{this.Request.PathBase.Value.ToString()}";
                    string passwordResetLink = Url.Content($"{baseUrl}/account/resetPassword/{model.Email}/{tokenEncoded}");

                    emailSender.SendResetPasswordEmail(user.Email, user.DisplayName, passwordResetLink);

                }

                return Ok(new { message = "Reset email sent successfully" });

            }

            return BadRequest(new { message = "Form has errors" });

        }

        [HttpGet("[action]")]
        public IActionResult ResetPassword([FromQuery] string email, [FromQuery] string tokenEncoded) {
            var model = new ResetPasswordViewModel {
                Email = email,
                Token = tokenEncoded
            };
            return Ok(model);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model) {

            if (ModelState.IsValid) {

                var user = await userManager.FindByEmailAsync(model.Email);

                if (user != null) {

                    var tokenDecoded = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
                    var result = await userManager.ResetPasswordAsync(user, tokenDecoded, model.Password);

                    if (result.Succeeded) {
                        return Ok(new { message = "Password is reset" });
                    }

                    List<string> errors = new List<string>();

                    foreach (var error in result.Errors) {
                        errors.Add(error.Description);
                    }

                    return BadRequest(new JsonResult(errors));

                }

            }

            return BadRequest();
        }
    }

}