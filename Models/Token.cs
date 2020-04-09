using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Transfers {

    public class Token {

        [Key]
        public int Id { get; set; }

        [Required]
        public string ClientId { get; set; }

        [Required]
        public string Value { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public DateTime LastModifiedDate { get; set; }

        [Required]
        public DateTime ExpiryTime { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

    }

}