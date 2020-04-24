using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {
    public class DestinationRepository : IDestinationRepository {

        private readonly AppDbContext appDbContext;
        public DestinationRepository(AppDbContext appDbContext) => (this.appDbContext) = (appDbContext);

        public async Task<IEnumerable<Destination>> Get() {
            return await appDbContext.Destinations.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        public async Task<Destination> GetById(int id) {
            return await appDbContext.Destinations.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);
        }

        public void Add(Destination Destination) {
            appDbContext.Destinations.AddAsync(Destination);
            appDbContext.SaveChanges();
        }

        public void Update(Destination Destination) {
            appDbContext.Entry(appDbContext.Destinations.Find(Destination.Id)).CurrentValues.SetValues(Destination);
            appDbContext.SaveChanges();
        }

        public void Delete(Destination Destination) {
            appDbContext.Destinations.Remove(Destination);
            appDbContext.SaveChanges();
        }
    }
}