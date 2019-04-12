using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Transfers.Models
{
	public class Context : IdentityDbContext<IdentityUser>
	{
		public Context(DbContextOptions<Context> options) : base(options) { }

		public DbSet<Customer> Customers { get; set; }
		public DbSet<TaxOffice> TaxOffices { get; set; }
		public DbSet<VATState> VATStates { get; set; }
		public DbSet<Route> Routes { get; set; }
		public DbSet<Destination> Destinations { get; set; }
		public DbSet<TransferType> TransferTypes { get; set; }
	}
}
