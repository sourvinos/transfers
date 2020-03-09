using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Transfers.Identity;

namespace Transfers.Models {

    public class ApplicationDbContext : IdentityDbContext<IdentityUser> {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<PickupPoint> PickupPoints { get; set; }
        public DbSet<Port> Ports { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<Transfer> Transfers { get; set; }

        public DbSet<TokenModel> Tokens { get; set; }

    }

}