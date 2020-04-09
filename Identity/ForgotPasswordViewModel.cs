using System.ComponentModel.DataAnnotations;

namespace Transfers {
    public class ForgotPasswordViewModel {

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

    }

}