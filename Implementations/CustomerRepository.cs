namespace Transfers {

    public class CustomerRepository : Repository<Customer>, ICustomerRepository {

        public CustomerRepository(AppDbContext appDbContext) : base(appDbContext) { }

    }

}