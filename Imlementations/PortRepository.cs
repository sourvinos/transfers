using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {
    public class PortRepository : IPortRepository {

        private readonly AppDbContext appDbContext;
        public PortRepository(AppDbContext appDbContext) => (this.appDbContext) = (appDbContext);

        public async Task<IEnumerable<Port>> Get() {
            return await appDbContext.Ports.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        public async Task<Port> GetById(int id) {
            return await appDbContext.Ports.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);
        }

        public void Add(Port Port) {
            appDbContext.Ports.AddAsync(Port);
            appDbContext.SaveChanges();
        }

        public void Update(Port Port) {
            appDbContext.Entry(appDbContext.Ports.Find(Port.Id)).CurrentValues.SetValues(Port);
            appDbContext.SaveChanges();
        }

        public void Delete(Port Port) {
            appDbContext.Ports.Remove(Port);
            appDbContext.SaveChanges();
        }
    }
}