using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    public class TransferRepository : ITransferRepository {

        private readonly IMapper mapper;
        private readonly AppDbContext appDbContext;

        public TransferRepository(AppDbContext appDbContext, IMapper mapper) => (this.appDbContext, this.mapper) = (appDbContext, mapper);

        TransferGroupResultResource<TransferResource> ITransferRepository.Get(DateTime dateIn) {

            var details = appDbContext.Transfers
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Where(x => x.DateIn == dateIn);

            var totalPersonsPerCustomer = appDbContext.Transfers.Include(x => x.Customer).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.Customer.Description }).Select(x => new TotalPersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });
            var totalPersonsPerDestination = appDbContext.Transfers.Include(x => x.Destination).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.Destination.Description }).Select(x => new TotalPersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });
            var totalPersonsPerRoute = appDbContext.Transfers.Include(x => x.PickupPoint.Route).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.PickupPoint.Route.Abbreviation }).Select(x => new TotalPersonsPerRoute { Description = x.Key.Abbreviation, Persons = x.Sum(s => s.TotalPersons) });
            var totalPersonsPerDriver = appDbContext.Transfers.Include(x => x.Driver).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.Driver.Description }).Select(x => new TotalPersonsPerDriver { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });
            var totalPersonsPerPort = appDbContext.Transfers.Include(x => x.PickupPoint.Route.Port).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.PickupPoint.Route.Port.Description }).Select(x => new TotalPersonsPerPort { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });

            var groupResult = new TransferGroupResult<Transfer> {
                Persons = details.Sum(x => x.TotalPersons),
                Transfers = details.ToList(),
                PersonsPerCustomer = totalPersonsPerCustomer.ToList(),
                PersonsPerDestination = totalPersonsPerDestination.ToList(),
                PersonsPerRoute = totalPersonsPerRoute.ToList(),
                PersonsPerDriver = totalPersonsPerDriver.ToList(),
                PersonsPerPort = totalPersonsPerPort.ToList()
            };

            return mapper.Map<TransferGroupResult<Transfer>, TransferGroupResultResource<TransferResource>>(groupResult);

        }

        public async Task<Transfer> GetById(int id) {
            return await appDbContext.Transfers
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .SingleOrDefaultAsync(m => m.Id == id);
        }

        public void Add(Transfer transfer) {
            appDbContext.Transfers.AddAsync(transfer);
            appDbContext.SaveChanges();
        }

        public void Update(SaveTransferResource saveTransferResource) {
            appDbContext.Entry(appDbContext.Transfers.Find(saveTransferResource.Id)).CurrentValues.SetValues(saveTransferResource);
            appDbContext.SaveChanges();
        }

        public void Delete(Transfer transfer) {
            appDbContext.Transfers.Remove(transfer);
            appDbContext.SaveChanges();
        }

        public void AssignDriver(int driverId, int[] ids) {
            var transfers = appDbContext.Transfers.Where(x => ids.Contains(x.Id)).ToList();
            transfers.ForEach(a => a.DriverId = driverId);
            appDbContext.SaveChangesAsync();
        }

    }

}