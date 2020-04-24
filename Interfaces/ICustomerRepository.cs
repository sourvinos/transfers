using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {
    public interface ICustomerRepository {
        Task<IEnumerable<Customer>> Get();
        Task<Customer> GetById(int id);
        void Add(Customer customer);
        void Update(Customer customer);
        void Delete(Customer customer);
    }
}