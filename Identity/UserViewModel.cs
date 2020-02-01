using System.ComponentModel.DataAnnotations;

namespace Transfers.Identity
{
    public class UserViewModel
    {
        public string Id { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public string Email { get; set; }
    }
}
