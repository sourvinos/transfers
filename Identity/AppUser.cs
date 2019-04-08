using Microsoft.AspNetCore.Identity;

namespace Transfers.Identity
{
	public class AppUser : IdentityUser
	{
		public string Name { get; set; }
	}
}
