using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {

    public interface IRouteRepository : IRepository<Route> {

        new Task<IList<Route>> Get();
        new Task<Route> GetById(int routeId);

    }

}