using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {
    public class DriverRepository : Repository<Driver>, IDriverRepository {

        public DriverRepository(AppDbContext context) : base(context) { }

        public async Task<Driver> GetDefault() {
            return await context.Drivers.AsNoTracking().SingleOrDefaultAsync(m => m.IsDefault);
        }

    }

}