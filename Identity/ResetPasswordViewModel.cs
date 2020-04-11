using System.ComponentModel.DataAnnotations;

namespace transfersViewModels {

    public class ResetPasswordViewModel {

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Password is required")]
        [MinLength(10, ErrorMessage = "Password can not be less than 10 characters long")]
        [MaxLength(128, ErrorMessage = "Password can not be more than 128 characters long")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }

        public string Token { get; set; }

    }

}