using System;
using System.Threading.Tasks;

namespace Transfers {

    public interface ITransferRepository : IRepository<Transfer> {

        TransferGroupResultResource<TransferResource> Get(DateTime dateIn);
        new Task<Transfer> GetById(int id);
        void Update(SaveTransferResource saveTransferResource);
        void AssignDriver(int driverId, int[] ids);

    }

}