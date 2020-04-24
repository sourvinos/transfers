using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {
    public class RouteRepository : IRouteRepository {

        private readonly AppDbContext appDbContext;
        public RouteRepository(AppDbContext appDbContext) => (this.appDbContext) = (appDbContext);

        public async Task<IEnumerable<Route>> Get() {
            return await appDbContext.Routes.Include(x => x.Port).OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        public async Task<Route> GetById(int id) {
            return await appDbContext.Routes.Include(x => x.Port).SingleOrDefaultAsync(m => m.Id == id);
        }

        public void Add(Route route) {
            appDbContext.Routes.AddAsync(route);
            appDbContext.SaveChanges();
        }

        public void Update(Route route) {
            appDbContext.Entry(appDbContext.Routes.Find(route.Id)).CurrentValues.SetValues(route);
            appDbContext.SaveChanges();
        }

        public void Delete(Route route) {
            appDbContext.Routes.Remove(route);
            appDbContext.SaveChanges();
        }
    }
}