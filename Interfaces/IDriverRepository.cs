using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {
    public interface IDriverRepository {

        Task<IEnumerable<Driver>> Get();
        Task<Driver> GetById(int id);
        Task<Driver> GetDefault();
        void Add(Driver driver);
        void Update(Driver driver);
        void Delete(Driver driver);

    }

}