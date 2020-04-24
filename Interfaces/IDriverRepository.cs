using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {
    public interface IDriverRepository {
        Task<IEnumerable<Driver>> Get();
        Task<Driver> GetById(int id);
        void Add(Driver Driver);
        void Update(Driver Driver);
        void Delete(Driver Driver);
    }
}