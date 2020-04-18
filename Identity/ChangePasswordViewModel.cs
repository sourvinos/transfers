using System.ComponentModel.DataAnnotations;

namespace Transfers {

    public class ChangePasswordViewModel {

        [Required(ErrorMessage = "User Id is required.")]
        public string UserId { get; set; }

        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Current password is required")]
        public string CurrentPassword { get; set; }

        [DataType(DataType.Password)]
        [Required(ErrorMessage = "New password is required")]
        [MinLength(10, ErrorMessage = "Password can not be less than 10 characters")]
        [MaxLength(128, ErrorMessage = "Password can not be longer than 128 characters")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }

    }

}