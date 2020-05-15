using System;
using System.Threading.Tasks;

namespace Transfers {

    public interface ITransferRepository : IRepository<Transfer> {

        TransferGroupResultResource<TransferResource> Get(DateTime dateIn);
        new Task<TransferResource> GetById(int id);
        Task<Transfer> GetByIdToDelete(int id);
        void Update(SaveTransferResource saveTransferResource);
        void AssignDriver(int driverId, int[] ids);

    }

}