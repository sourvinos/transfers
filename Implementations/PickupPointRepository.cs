using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {
    public class PickupPointRepository : IPickupPointRepository {

        private readonly AppDbContext appDbContext;
        public PickupPointRepository(AppDbContext appDbContext) => (this.appDbContext) = (appDbContext);

        public async Task<IEnumerable<PickupPoint>> Get() {
            return await appDbContext.PickupPoints.Include(x => x.Route).OrderBy(o => o.Time).ThenBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<PickupPoint>> GetForRoute(int routeId) {
            return await appDbContext.PickupPoints.Include(x => x.Route).Where(m => m.RouteId == routeId).OrderBy(o => o.Time).ThenBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        public async Task<PickupPoint> GetById(int id) {
            return await appDbContext.PickupPoints.Include(x => x.Route).AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);
        }

        public void Add(PickupPoint pickupPoint) {
            appDbContext.PickupPoints.AddAsync(pickupPoint);
            appDbContext.SaveChanges();
        }

        public void Update(PickupPoint pickupPoint) {
            appDbContext.Entry(appDbContext.PickupPoints.Find(pickupPoint.Id)).CurrentValues.SetValues(pickupPoint);
            appDbContext.SaveChanges();
        }

        public void Delete(PickupPoint pickupPoint) {
            appDbContext.PickupPoints.Remove(pickupPoint);
            appDbContext.SaveChanges();
        }

    }

}