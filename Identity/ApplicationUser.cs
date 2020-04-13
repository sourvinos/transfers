using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Transfers {
    public class ApplicationUser : IdentityUser {
        public string DisplayName { get; set; }
        public virtual List<Token> Tokens { get; set; }
    }
}