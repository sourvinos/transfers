using System.ComponentModel.DataAnnotations;

namespace Transfers {

    public class Destination {

        public int Id { get; set; }

        [MaxLength(5, ErrorMessage = "Abbreviation can not be longer than 5 characters")]
        public string Abbreviation { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [MaxLength(128, ErrorMessage = "Description can not be longer than 128 characters")]
        public string Description { get; set; }

        public bool IsActive { get; set; }

        [Required(ErrorMessage = "User Id is required")]
        [MaxLength(128, ErrorMessage = "User Id can not be longer than 128 characters")]
        public string UserId { get; set; }

    }

}