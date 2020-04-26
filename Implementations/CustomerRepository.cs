using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    public class CustomerRepository : ICustomerRepository {

        private readonly AppDbContext appDbContext;

        public CustomerRepository(AppDbContext appDbContext) => (this.appDbContext) = (appDbContext);

        public async Task<IEnumerable<Customer>> Get() {
            return await appDbContext.Customers.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        public async Task<Customer> GetById(int id) {
            return await appDbContext.Customers.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);
        }

        public void Add(Customer customer) {
            appDbContext.Customers.AddAsync(customer);
            appDbContext.SaveChanges();
        }

        public void Update(Customer customer) {
            appDbContext.Entry(appDbContext.Customers.Find(customer.Id)).CurrentValues.SetValues(customer);
            appDbContext.SaveChanges();
        }

        public void Delete(Customer customer) {
            appDbContext.Customers.Remove(customer);
            appDbContext.SaveChanges();
        }

    }

}