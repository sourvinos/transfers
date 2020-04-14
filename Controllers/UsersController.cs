using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    [Route("api/[controller]")]
    // [Authorize(Policy = "RequireLoggedIn")]
    public class UsersController : ControllerBase {

        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signManager;

        public UsersController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager) =>
            (this.userManager, this.signManager) = (userManager, signInManager);

        // GET: api/users
        [HttpGet]
        public async Task<IEnumerable<UserListViewModel>> Get() {
            return await userManager.Users.Select(u => new UserListViewModel {
                Id = u.Id,
                    Username = u.UserName,
                    Displayname = u.DisplayName,
                    Email = u.Email
            }).OrderBy(o => o.Username).AsNoTracking().ToListAsync();
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id) {
            UserViewModel vm = new UserViewModel { };
            ApplicationUser user = await userManager.FindByIdAsync(id);
            if (user != null) {
                vm.Id = user.Id;
                vm.Username = user.UserName;
                vm.Displayname = user.DisplayName;
                vm.Email = user.Email;
                return Ok(vm);
            }
            return NotFound(new { response = "Record not found" });
        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser([FromRoute] string id, [FromBody] UserViewModel vm) {
            if (ModelState.IsValid) {
                if (id != vm.Id) return BadRequest(new { response = "Unexpected user id" });
                ApplicationUser user = await userManager.FindByIdAsync(id);
                if (user != null) {
                    user.UserName = vm.Username;
                    user.DisplayName = vm.Displayname;
                    user.Email = vm.Email;
                    IdentityResult result = await userManager.UpdateAsync(user);
                    if (result.Succeeded) {
                        return Ok(new { response = "Record updated" });
                    }
                    return BadRequest(new { response = result.Errors.Select(x => x.Description) });
                }
                return NotFound(new { response = "Record not found" });
            }
            return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id) {
            ApplicationUser user = await userManager.FindByIdAsync(id);
            if (user != null) {
                IdentityResult result = await userManager.DeleteAsync(user);
                if (result.Succeeded) {
                    return Ok(new { response = "Record deleted" });
                }
            }
            return NotFound(new { response = "Record not found" });
        }

    }

}