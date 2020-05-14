namespace Transfers {

    public class PortRepository : Repository<Port>, IPortRepository {

        public PortRepository(AppDbContext appDbContext) : base(appDbContext) { }

    }

}