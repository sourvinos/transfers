using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    public class DestinationRepository : Repository<Destination>, IDestinationRepository {

        public DestinationRepository(AppDbContext appDbContext) : base(appDbContext) { }

        public async Task<IEnumerable<Destination>> GetActive() => await context.Set<Destination>().Where(x => x.IsActive).ToListAsync();

    }

}