using Microsoft.AspNetCore.Mvc;

namespace Transfers {

    public class NotificationsController : Controller {

        public IActionResult EmailConfirmation(string userId, string token) {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token)) {
                return Redirect("/login");
            }
            return View();
        }

        public IActionResult EmailConfirmationError() =>
            View();

        public IActionResult UserNotFound() =>
            Redirect("/login");

    }

}