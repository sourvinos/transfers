using Microsoft.AspNetCore.Mvc;

namespace Transfers.Controllers {

    public class NotificationsController : Controller {

        public IActionResult EmailConfirmation(string userId, string code) {

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code)) {
                return Redirect("/login");
            }

            return View();

        }

        public IActionResult ResetPasswordConfirmation() {

            return View();

        }

    }

}