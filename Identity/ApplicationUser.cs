using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Transfers.Models;

namespace Transfers.Identity {

    public class ApplicationUser : IdentityUser {

        public string DisplayName { get; set; }
        public virtual List<Token> Tokens { get; set; }

    }
}