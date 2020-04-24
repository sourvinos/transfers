using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {
    public interface IPickupPointRepository {
        Task<IEnumerable<PickupPoint>> Get();
        Task<IEnumerable<PickupPoint>> GetForRoute(int routeId);
        Task<PickupPoint> GetById(int id);
        void Add(PickupPoint pickupPoint);
        void Update(PickupPoint pickupPoint);
        void Delete(PickupPoint pickupPoint);
    }
}