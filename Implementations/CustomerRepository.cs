using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    public class CustomerRepository : Repository<Customer>, ICustomerRepository {

        public CustomerRepository(AppDbContext appDbContext) : base(appDbContext) { }

        public async Task<IEnumerable<Customer>> GetActive() => await context.Set<Customer>().Where(x => x.IsActive).ToListAsync();

    }

}