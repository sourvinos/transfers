using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {

    public interface ICustomerRepository : IRepository<Customer> {

        Task<IEnumerable<Customer>> GetActive();

    }

}