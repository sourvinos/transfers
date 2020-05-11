using System.Threading.Tasks;

namespace Transfers {

    public interface IDriverRepository : IRepository<Driver> {
        Task<Driver> GetDefaultDriver();
        Task<bool> CheckForDuplicateDefaultDriver(int? id, Driver driver);
    }

}