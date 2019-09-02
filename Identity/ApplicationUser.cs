using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Transfers.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }

        public virtual List<TokenModel> Tokens { get; set; }
    }
}
