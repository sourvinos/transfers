using System;
using System.Threading.Tasks;

namespace Transfers {

    public interface ITransferRepository {

        TransferGroupResultResource<TransferResource> Get(DateTime dateIn);
        Task<Transfer> GetById(int id);
        void Add(Transfer transfer);
        void Update(SaveTransferResource saveTransferResource);
        void Delete(Transfer transfer);
        void AssignDriver(int driverId, int[] ids);

    }

}