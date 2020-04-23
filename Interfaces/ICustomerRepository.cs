using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {
    public interface ICustomerRepository {
        Task<IEnumerable<Customer>> GetCustomers();
        Task<Customer> GetCustomer(int customerId);
        void AddCustomer(Customer customer);
        void UpdateCustomer(Customer customer);
        void DeleteCustomer(Customer customer);
    }
}