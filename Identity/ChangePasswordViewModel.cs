using System.ComponentModel.DataAnnotations;

namespace Transfers {

    public class ChangePasswordViewModel {

        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Current password is required")]
        public string CurrentPassword { get; set; }

        [DataType(DataType.Password)]
        [Required(ErrorMessage = "New password is required")]
        [MaxLength(128, ErrorMessage = "New password can not be longer than 128 characters")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "New password and confirm new password do not match")]
        public string ConfirmPassword { get; set; }

    }

}