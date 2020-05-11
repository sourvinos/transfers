using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {
    public class DriverRepository : Repository<Driver>, IDriverRepository {

        public DriverRepository(AppDbContext context) : base(context) { }

        public async Task<Driver> GetDefaultDriver() {
            return await context.Drivers.AsNoTracking().SingleOrDefaultAsync(m => m.IsDefault);
        }

        async Task<bool> IDriverRepository.CheckForDuplicateDefaultDriver(int? id, Driver driver) {
            if (driver.IsDefault) {
                if (id == null) {
                    var defaultDriver = await context.Drivers.AsNoTracking().Where(m => m.IsDefault).ToListAsync();
                    return true;
                } else {
                    var defaultDriver = await context.Drivers.AsNoTracking().Where(m => m.Id != id).Where(m => m.IsDefault).ToListAsync();
                    return true;
                }
            }
            return false;
        }

    }

}