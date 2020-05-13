using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {

    public interface IPortRepository : IRepository<Port> {

        Task<IEnumerable<Port>> GetActive();

    }

}