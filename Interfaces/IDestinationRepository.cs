using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {
    public interface IDestinationRepository {
        Task<IEnumerable<Destination>> Get();
        Task<Destination> GetById(int id);
        void Add(Destination destination);
        void Update(Destination destination);
        void Delete(Destination destination);
    }
}