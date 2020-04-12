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

namespace Transfers {

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
    }

}