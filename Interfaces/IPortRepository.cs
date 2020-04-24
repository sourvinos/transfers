using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {
    public interface IPortRepository {
        Task<IEnumerable<Port>> Get();
        Task<Port> GetById(int id);
        void Add(Port Port);
        void Update(Port Port);
        void Delete(Port Port);
    }
}