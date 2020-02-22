using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Transfers.Identity;

namespace Transfers.Controllers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]

    public class UsersController : Controller {

        // Variables
        private readonly UserManager<ApplicationUser> userManager;

        // Constructor
        public UsersController(UserManager<ApplicationUser> userManager) {

            this.userManager = userManager;

        }

        // GET: api/users
        [HttpGet]
        public List<UserListViewModel> Get() {

            List<UserListViewModel> vm = new List<UserListViewModel>();

            vm = userManager.Users.Select(u => new UserListViewModel {
                Id = u.Id,
                    UserName = u.UserName,
                    DisplayName = u.DisplayName,
                    Email = u.Email
            }).ToList();

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

        [HttpPost]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel vm) {

            if (ModelState.IsValid) {

                var user = await userManager.GetUserAsync(User);
                var result = await userManager.ChangePasswordAsync(user, vm.CurrentPassword, vm.NewPassword);

                if (!result.Succeeded) {
                    return BadRequest();
                }

                return Ok(user);

            }

            return BadRequest();

        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser([FromRoute] string id, [FromBody] UserViewModel vm) {

            if (!ModelState.IsValid) return BadRequest(ModelState);
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

    }

}