using System.ComponentModel.DataAnnotations;

namespace Transfers {

    public class RegisterViewModel {

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        [MaxLength(128, ErrorMessage = "Email can not be longer than 128 characters")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Display name is required")]
        [MaxLength(32, ErrorMessage = "Email can not be longer than 32 characters")]
        public string Displayname { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [MaxLength(32, ErrorMessage = "Username can not be longer than 32 characters")]
        public string Username { get; set; }

        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Password is required")]
        [MaxLength(128, ErrorMessage = "Password can not be longer than 128 characters")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }

    }

}