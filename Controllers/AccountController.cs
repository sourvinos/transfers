using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Transfers.Identity;

namespace Transfers.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        // Variables 
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signManager;
        private readonly AppSettings _appSettings;

        // Constructor
        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IOptions<AppSettings> appSettings)
        {
            _userManager = userManager;
            _signManager = signInManager;
            _appSettings = appSettings.Value;
        }

        // api/account/register
        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel formdata)
        {
            var user = new ApplicationUser
            {
                Email = formdata.Email,
                UserName = formdata.UserName,
                DisplayName = formdata.DisplayName,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, formdata.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");

                return Ok(new { userName = user.UserName, displayName = user.DisplayName, email = user.Email, status = 1, message = "Registration Successful" });
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
            }

            return Forbid();
        }
    }
}