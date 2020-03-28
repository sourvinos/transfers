using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Transfers.Identity;
using Transfers.Models;

namespace Transfers.Controllers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]

    public class UsersController : ControllerBase {

        // Variables
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signManager;
        private readonly EmailSettings emailSettings;

        // Constructor
        public UsersController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IOptions<EmailSettings> emailSettings) {
            this.userManager = userManager;
            this.signManager = signInManager;
            this.emailSettings = emailSettings.Value;
        }

        // GET: api/users
        [HttpGet]
        public async Task<IEnumerable<UserListViewModel>> Get() {

            List<UserListViewModel> vm = new List<UserListViewModel>();

            vm = await userManager.Users.Select(u => new UserListViewModel {
                Id = u.Id,
                    UserName = u.UserName,
                    DisplayName = u.DisplayName,
                    Email = u.Email
            }).OrderBy(o => o.UserName).AsNoTracking().ToListAsync();

            return vm;
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<UserViewModel> GetUser(string id) {

            UserViewModel vm = new UserViewModel { };

            if (!String.IsNullOrEmpty(id)) {
                ApplicationUser user = await userManager.FindByIdAsync(id);
                if (user != null) {
                    vm.Id = user.Id;
                    vm.UserName = user.UserName;
                    vm.DisplayName = user.DisplayName;
                    vm.Email = user.Email;
                }
            }

            return vm;

        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> PostUser([FromBody] RegisterViewModel formdata) {

            if (!ModelState.IsValid) return BadRequest();

            var user = new ApplicationUser { Email = formdata.Email, UserName = formdata.UserName, DisplayName = formdata.DisplayName, SecurityStamp = Guid.NewGuid().ToString() };
            var result = await userManager.CreateAsync(user, formdata.Password);

            if (result.Succeeded) {
                await AddUserToRole(user);
                await SendConfirmationEmail(user);

                return Ok(user);
            }

            return StatusCode(409);

        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser([FromRoute] string id, [FromBody] UserViewModel vm) {

            if (!ModelState.IsValid) return BadRequest();
            if (id != vm.Id) return BadRequest();

            ApplicationUser user = await userManager.FindByIdAsync(id);

            if (user != null) {
                user.UserName = vm.UserName;
                user.DisplayName = vm.DisplayName;
                user.Email = vm.Email;

                IdentityResult result = await userManager.UpdateAsync(user);

                if (result.Succeeded) {
                    return Ok(user);
                }
            }

            return NotFound();

        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id) {

            ApplicationUser user = await userManager.FindByIdAsync(id);

            if (user != null) {

                IdentityResult result = await userManager.DeleteAsync(user);

                if (result.Succeeded) {
                    return Ok(user);
                }

            }

            return NotFound();

        }

        // POST: api/users/5
        [HttpPost("{id}")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel vm) {
            if (ModelState.IsValid) {
                var user = await userManager.GetUserAsync(User);
                if (user == null) return NotFound();
                var result = await userManager.ChangePasswordAsync(user, vm.CurrentPassword, vm.NewPassword);
                if (result.Succeeded) {
                    await signManager.RefreshSignInAsync(user);
                    return Ok();
                }
                return StatusCode(406);
            }
            return BadRequest();
        }

        // Caller: PostUser()
        private async Task<IActionResult> AddUserToRole(ApplicationUser user) {

            var result = await userManager.AddToRoleAsync(user, "User");

            return Ok();

        }

        // Caller: PostUser()
        private async Task<IActionResult> SendConfirmationEmail(ApplicationUser user) {

            string token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            string confirmationLink = Url.Action("confirmEmail", "account", new { userId = user.Id, token = token }, Request.Scheme);

            confirmationLink = confirmationLink.Replace("/api", "");
            confirmationLink = confirmationLink.Replace("?userId=", "/");
            confirmationLink = confirmationLink.Replace("&token=", "/");

            using(MailMessage mail = new MailMessage()) {
                mail.From = new MailAddress(emailSettings.From);
                mail.To.Add(user.Email);
                mail.Subject = "Complete your account setup";
                mail.Body = "<h2 style='color: #FE9F36;'>Hello, " + user.DisplayName + "!" + "</h2>";
                mail.Body += "<h2 style='color: #2e6c80;'>Welcome to People Movers!</h2>";
                mail.Body += "<p>Click the following button to confirm your email account.</p>";
                mail.Body += "<a style='margin: 1rem 0; background-color: #FE9F36; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;' href=" + confirmationLink + ">Confirm email</a>";
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