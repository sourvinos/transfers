using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {
    public class DriverRepository : IDriverRepository {

        private readonly AppDbContext appDbContext;
        public DriverRepository(AppDbContext appDbContext) => (this.appDbContext) = (appDbContext);

        public async Task<IEnumerable<Driver>> Get() {
            return await appDbContext.Drivers.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        public async Task<Driver> GetById(int id) {
            return await appDbContext.Drivers.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);
        }

        public void Add(Driver Driver) {
            appDbContext.Drivers.AddAsync(Driver);
            appDbContext.SaveChanges();
        }

        public void Update(Driver Driver) {
            appDbContext.Entry(appDbContext.Drivers.Find(Driver.Id)).CurrentValues.SetValues(Driver);
            appDbContext.SaveChanges();
        }

        public void Delete(Driver Driver) {
            appDbContext.Drivers.Remove(Driver);
            appDbContext.SaveChanges();
        }
    }
}