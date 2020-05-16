using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    public class RouteRepository : Repository<Route>, IRouteRepository {

        public RouteRepository(AppDbContext context) : base(context) { }

        async Task<IList<Route>> IRouteRepository.Get() =>
            await context.Routes.Include(p => p.Port).ToListAsync();

        public new async Task<Route> GetById(int routeId) =>
            await context.Routes.Include(p => p.Port).AsNoTracking().SingleOrDefaultAsync(m => m.Id == routeId);

    }

}