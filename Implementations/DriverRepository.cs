using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    public class DriverRepository : Repository<Driver>, IDriverRepository {

        public DriverRepository(AppDbContext context) : base(context) { }

        public async Task<Driver> GetDefaultDriver() =>
            await context.Drivers.AsNoTracking().SingleOrDefaultAsync(m => m.IsDefault);

        async Task<string> IDriverRepository.CheckDefaultDriverExists(int? id, Driver driver) {
            if (driver.IsDefault) {
                if (id == null) {
                    var defaultDriver = await context.Drivers.AsNoTracking().Where(m => m.IsDefault).FirstOrDefaultAsync();
                    if (defaultDriver != null)
                        return defaultDriver.Description;
                } else {
                    var defaultDriver = await context.Drivers.AsNoTracking().Where(m => m.Id != id && m.IsDefault).FirstOrDefaultAsync();
                    if (defaultDriver != null)
                        return defaultDriver.Description;
                }
            }
            return null;
        }

    }

}