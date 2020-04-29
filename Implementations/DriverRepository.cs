using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {
    public class DriverRepository : Repository<Driver>, IDriverRepository {

        private readonly AppDbContext appDbContext;
        public DriverRepository(AppDbContext appDbContext) : base(appDbContext) { }

        public async Task<Driver> GetDefault() {
            return await appDbContext.Drivers.SingleOrDefaultAsync(m => m.IsDefault);
        }

    }

}