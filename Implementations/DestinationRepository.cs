namespace Transfers {

    public class DestinationRepository : Repository<Destination>, IDestinationRepository {

        public DestinationRepository(AppDbContext appDbContext) : base(appDbContext) { }

    }

}