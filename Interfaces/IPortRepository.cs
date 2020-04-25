using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {

    public interface IPortRepository {

        Task<IEnumerable<Port>> Get();
        Task<Port> GetById(int id);
        void Add(Port port);
        void Update(Port port);
        void Delete(Port port);

    }

}