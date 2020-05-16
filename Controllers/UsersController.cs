using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]
    public class UsersController : ControllerBase {

        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signManager;

        public UsersController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager) =>
            (this.userManager, this.signManager) = (userManager, signInManager);

        [HttpGet]
        public async Task<IEnumerable<UserListViewModel>> Get() =>
            await userManager.Users.Select(u => new UserListViewModel {
                Id = u.Id,
                    Username = u.UserName,
                    Displayname = u.DisplayName,
                    Email = u.Email
            }).OrderBy(o => o.Username).AsNoTracking().ToListAsync();

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
            return NotFound(new { response = ApiMessages.RecordNotFound() });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser([FromRoute] string id, [FromBody] UserViewModel vm) {
            if (ModelState.IsValid) {
                if (id != vm.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
                ApplicationUser user = await userManager.FindByIdAsync(id);
                if (user != null) {
                    user.UserName = vm.Username;
                    user.DisplayName = vm.Displayname;
                    user.Email = vm.Email;
                    IdentityResult result = await userManager.UpdateAsync(user);
                    if (result.Succeeded) {
                        return Ok(new { response = ApiMessages.RecordUpdated() });
                    }
                    return BadRequest(new { response = result.Errors.Select(x => x.Description) });
                }
                return NotFound(new { response = ApiMessages.RecordNotFound() });
            }
            return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id) {
            ApplicationUser user = await userManager.FindByIdAsync(id);
            if (user != null) {
                IdentityResult result = await userManager.DeleteAsync(user);
                if (result.Succeeded) {
                    return Ok(new { response = ApiMessages.RecordDeleted() });
                }
            }
            return NotFound(new { response = ApiMessages.RecordNotFound() });
        }

    }

}