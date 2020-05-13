using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {

    public interface IPickupPointRepository : IRepository<PickupPoint> {

        new Task<IEnumerable<PickupPoint>> Get();
        Task<IEnumerable<PickupPoint>> GetForRoute(int routeId);
        new Task<PickupPoint> GetById(int pickupPointId);

    }

}