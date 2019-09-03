using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Transfers.Models;
using Transfers.Resources;

namespace Transfers.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]
    public class TransfersController : ControllerBase
    {
        // Variables
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        // Constructor
        public TransfersController(IMapper mapper, ApplicationDbContext context)
        {
            this.mapper = mapper;
            this.context = context;
        }

        // GET: api/transfers/getByDate/YYYY-MM-DD
        [HttpGet("getByDate/{dateIn}")]
        public TransferGroupResultResource<TransferResource> getTransfers(DateTime dateIn)
        {
            var details = context.Transfers
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint).ThenInclude(x => x.Route).ThenInclude(x => x.Port)
                .Include(x => x.Destination)
                .Where(x => x.DateIn == dateIn).OrderBy(x => x.PickupPoint.Route.Description);
            var totalPersonsPerCustomer = context.Transfers.Include(x => x.Customer).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.Customer.Description }).Select(x => new TotalPersonsPerCustomer { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });
            var TotalPersonsPerDestination = context.Transfers.Include(x => x.Destination).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.Destination.Description }).Select(x => new TotalPersonsPerDestination { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });
            var TotalPersonsPerRoute = context.Transfers.Include(x => x.PickupPoint.Route).Where(x => x.DateIn == dateIn).GroupBy(x => new { x.PickupPoint.Route.Description }).Select(x => new TotalPersonsPerRoute { Description = x.Key.Description, Persons = x.Sum(s => s.TotalPersons) });

            var groupResult = new TransferGroupResult<Transfer>
            {
                Persons = details.Sum(x => x.TotalPersons),
                Transfers = details.ToList(),
                PersonsPerCustomer = totalPersonsPerCustomer.ToList(),
                PersonsPerDestination = TotalPersonsPerDestination.ToList(),
                PersonsPerRoute = TotalPersonsPerRoute.ToList()
            };

            return mapper.Map<TransferGroupResult<Transfer>, TransferGroupResultResource<TransferResource>>(groupResult);
        }

        // GET: api/transfers/5
        [HttpGet("{id}")]
        public async Task<TransferResource> GetTransfer(int id)
        {
            Transfer transfer = await context.Transfers
                .Include(x => x.Customer)
                .Include(x => x.PickupPoint)
                    .ThenInclude(x => x.Route)
                .Include(x => x.Destination)
                .SingleOrDefaultAsync(m => m.Id == id);

            return mapper.Map<Transfer, TransferResource>(transfer);
        }

        // POST: api/transfers
        [HttpPost]
        public async Task<IActionResult> PostTransfer([FromBody] Transfer transfer)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            context.Transfers.Add(transfer);

            await context.SaveChangesAsync();

            return Ok(transfer);
        }

        // PUT: api/transfers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransfer([FromRoute] int id, [FromBody] SaveTransferResource transferResource)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id != transferResource.Id) return BadRequest();

            var transfer = await context.Transfers.SingleOrDefaultAsync(m => m.Id == id);

            mapper.Map<SaveTransferResource, Transfer>(transferResource, transfer);

            context.Entry(transfer).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                transfer = await context.Transfers.SingleOrDefaultAsync(m => m.Id == id);

                if (transfer == null) return NotFound(); else throw;
            }

            return Ok();
        }

        // DELETE: api/transfers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransfer([FromRoute] int id)
        {
            Transfer transfer = await context.Transfers.SingleOrDefaultAsync(m => m.Id == id);

            if (transfer == null) return NotFound();

            context.Transfers.Remove(transfer);

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}