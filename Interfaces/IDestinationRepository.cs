using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {

    public interface IDestinationRepository : IRepository<Destination> {

        Task<IEnumerable<Destination>> GetActive();

    }

}