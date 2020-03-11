using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transfers.Models;
using Transfers.Resources;

namespace Transfers.Controllers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]

    public class TransfersController : ControllerBase {

        // Variables
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        // Constructor
        public TransfersController(IMapper mapper, ApplicationDbContext context) {

            this.mapper = mapper;
            this.context = context;

        }

        // GET: api/transfers/date/YYYY-MM-DD
        [HttpGet("date/{dateIn}")]
        public TransferGroupResultResource<TransferResource> getTransfers(DateTime dateIn) {

            var details = context.Transfers
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Where(x => x.DateIn == dateIn);
            var totalPersonsPerCustomer = context.Transfers.Include(x => x.Customer).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.Customer.Description }).Select(x => new TotalPersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });
            var totalPersonsPerDestination = context.Transfers.Include(x => x.Destination).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.Destination.Description }).Select(x => new TotalPersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });
            var totalPersonsPerRoute = context.Transfers.Include(x => x.PickupPoint.Route).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.PickupPoint.Route.Abbreviation }).Select(x => new TotalPersonsPerRoute { Description = x.Key.Abbreviation, Persons = x.Sum(s => s.TotalPersons) });
            var totalPersonsPerDriver = context.Transfers.Include(x => x.Driver).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.Driver.Description }).Select(x => new TotalPersonsPerDriver { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });
            var totalPersonsPerPort = context.Transfers.Include(x => x.PickupPoint.Route.Port).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.PickupPoint.Route.Port.Description }).Select(x => new TotalPersonsPerPort { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });

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

        // GET: api/transfers/5
        [HttpGet("{id}")]
        public async Task<TransferResource> GetTransfer(int id) {

            Transfer transfer = await context.Transfers
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(y => y.Route).ThenInclude(z => z.Port)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .SingleOrDefaultAsync(m => m.Id == id);

            return mapper.Map<Transfer, TransferResource>(transfer);

        }

        // POST: api/transfers
        [HttpPost]
        public async Task<IActionResult> PostTransfer([FromBody] Transfer transfer) {

            if (!ModelState.IsValid) return BadRequest();

            context.Transfers.Add(transfer);

            await context.SaveChangesAsync();

            return Ok(transfer);

        }

        // PUT: api/transfers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransfer([FromRoute] int id, [FromBody] SaveTransferResource transferResource) {

            if (!ModelState.IsValid) return BadRequest();
            if (id != transferResource.Id) return BadRequest();

            var transfer = await context.Transfers.SingleOrDefaultAsync(m => m.Id == id);

            mapper.Map<SaveTransferResource, Transfer>(transferResource, transfer);

            context.Entry(transfer).State = EntityState.Modified;

            try {
                await context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                transfer = await context.Transfers.SingleOrDefaultAsync(m => m.Id == id);

                if (transfer == null) return NotFound();
            }

            return Ok();

        }

        // PATCH: api/transfers/assignDriver?driverId=7&id=77905&id=77910
        [HttpPatch("assignDriver")]
        public async Task<IActionResult> AssignDriver(int driverId, [FromQuery(Name = "id")] int[] ids) {

            var transfers = await context.Transfers.Where(x => ids.Contains(x.Id)).ToListAsync();

            transfers.ForEach(a => a.DriverId = driverId);

            await context.SaveChangesAsync();

            return Ok(transfers);

        }

        // DELETE: api/transfers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransfer([FromRoute] int id) {

            Transfer transfer = await context.Transfers.SingleOrDefaultAsync(m => m.Id == id);

            if (transfer == null) return NotFound();

            context.Transfers.Remove(transfer);

            await context.SaveChangesAsync();

            return NoContent();

        }

    }

}