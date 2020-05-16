using System.ComponentModel.DataAnnotations;

namespace Transfers {

    public class Customer {

        public int Id { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [MaxLength(128, ErrorMessage = "Description can not be longer than 128 characters")]
        public string Description { get; set; }

        [MaxLength(128, ErrorMessage = "Profession can not be longer than 128 characters")]
        public string Profession { get; set; }

        [MaxLength(128, ErrorMessage = "Address can not be longer than 128 characters")]
        public string Address { get; set; }

        [MaxLength(128, ErrorMessage = "Phones can not be longer than 128 characters")]
        public string Phones { get; set; }

        [MaxLength(128, ErrorMessage = "Person in charge can not be longer than 128 characters")]
        public string PersonInCharge { get; set; }

        [MaxLength(128, ErrorMessage = "Email can not be longer than 128 characters")]
        public string Email { get; set; }

        public bool IsActive { get; set; }

        [Required(ErrorMessage = "User id is required")]
        [MaxLength(128, ErrorMessage = "User id can not be longer than 128 characters")]
        public string UserId { get; set; }

    }

}