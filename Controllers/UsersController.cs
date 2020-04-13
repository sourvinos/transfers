using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Transfers {

    [Route("api/[controller]")]
    // [Authorize(Policy = "RequireLoggedIn")]
    public class UsersController : ControllerBase {

        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signManager;
        private readonly EmailSettings emailSettings;

        public UsersController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IOptions<EmailSettings> emailSettings) =>
            (this.userManager, this.signManager, this.emailSettings) = (userManager, signInManager, emailSettings.Value);

        // GET: api/users
        [HttpGet("[action]")]
        public async Task<IActionResult> Get() {
            List<UserListViewModel> vm = new List<UserListViewModel>();
            vm = await userManager.Users.Select(u => new UserListViewModel { Id = u.Id, UserName = u.UserName, DisplayName = u.DisplayName, Email = u.Email }).OrderBy(o => o.UserName).AsNoTracking().ToListAsync();
            if (vm != null) {
                return Ok(new { response = vm });
            }
            return BadRequest(new { response = "Unable to get data from the server" });
        }

        // GET: api/users/5
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetUser(string id) {
            UserViewModel vm = new UserViewModel { };
            ApplicationUser user = await userManager.FindByIdAsync(id);
            if (user != null) {
                vm.Id = user.Id;
                vm.UserName = user.UserName;
                vm.DisplayName = user.DisplayName;
                vm.Email = user.Email;
                return Ok(vm);
            }
            return BadRequest(new { response = "Record not found" });
        }

        // PUT: api/users/5
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> PutUser([FromRoute] string id, [FromBody] UserViewModel vm) {
            if (ModelState.IsValid) {
                if (id != vm.Id) return BadRequest(new { response = "Unexpected user id" });
                ApplicationUser user = await userManager.FindByIdAsync(id);
                if (user != null) {
                    user.UserName = vm.UserName;
                    user.DisplayName = vm.DisplayName;
                    user.Email = vm.Email;
                    IdentityResult result = await userManager.UpdateAsync(user);
                    if (result.Succeeded) {
                        return Ok(user);
                    }
                    return BadRequest(new { response = result.Errors.Select(x => x.Description) });
                }
                return NotFound(new { response = "User not found" });
            }
            return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

        // DELETE: api/users/5
        [HttpDelete("[action]/{id}")]
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