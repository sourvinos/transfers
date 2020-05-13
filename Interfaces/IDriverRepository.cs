using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {

    public interface IDriverRepository : IRepository<Driver> {

        Task<Driver> GetDefaultDriver();
        Task<string> CheckDefaultDriverExists(int? id, Driver driver);
        Task<IEnumerable<Driver>> GetActive();
    }

}