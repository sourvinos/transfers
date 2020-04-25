using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {

    public interface IRouteRepository {

        Task<IEnumerable<Route>> Get();
        Task<Route> GetById(int id);
        void Add(Route route);
        void Update(Route route);
        void Delete(Route route);

    }

}