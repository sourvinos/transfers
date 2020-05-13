using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    public class PortRepository : Repository<Port>, IPortRepository {

        public PortRepository(AppDbContext appDbContext) : base(appDbContext) { }

        public async Task<IEnumerable<Port>> GetActive() => await context.Set<Port>().Where(x => x.IsActive).ToListAsync();

    }

}