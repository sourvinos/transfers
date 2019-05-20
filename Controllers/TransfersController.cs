using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Transfers.Models;
using Transfers.Resources;

namespace Transfers.Controllers
{
	[Route("api/[controller]")]
	public class TransfersController : ControllerBase
	{
		private readonly IMapper mapper;
		private readonly Context context;

		public TransfersController(IMapper mapper, Context context)
		{
			this.mapper = mapper;
			this.context = context;
		}

		[HttpGet("getByCustomerId/{customerId}")]
		public async Task<IEnumerable<TransferResource>> getByCustomerId(int customerId)
		{
			var items = await context.Transfers
				.Include(x => x.Customer)
				.Include(x => x.TransferType)
				.Include(x => x.PickupPoint)
					.ThenInclude(x => x.Route)
				.Include(x => x.Destination)
				.Where(x => x.CustomerId == customerId).ToListAsync();

			return mapper.Map<IEnumerable<Transfer>, IEnumerable<TransferResource>>(items);
		}

		[HttpGet("getByDate/{fromDate}")]
		public async Task<IEnumerable<TransferResource>> getByDate(DateTime fromDate)
		{
			var items = await context.Transfers
				.Include(x => x.Customer)
				.Include(x => x.TransferType)
				.Include(x => x.PickupPoint)
					.ThenInclude(x => x.Route)
				.Include(x => x.Destination)
				.Where(x => x.Date == fromDate).ToListAsync();

			return mapper.Map<IEnumerable<Transfer>, IEnumerable<TransferResource>>(items);
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetTransfer(int id)
		{
			Transfer transfer = await context.Transfers
				.Include(x => x.Customer)
				.Include(x => x.TransferType)
				.Include(x => x.PickupPoint)
				.Include(x => x.Destination)
				.SingleOrDefaultAsync(m => m.Id == id);

			if (transfer == null) { return NotFound(); }

			return Ok(transfer);
		}

		[HttpPost]
		public async Task<IActionResult> PostTransfer([FromBody] Transfer transfer)
		{
			if (ModelState.IsValid)
			{
				context.Transfers.Add(transfer);
				await context.SaveChangesAsync();

				return Ok(transfer);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutTransfer([FromRoute] int id, [FromBody] Transfer transfer)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != transfer.Id) return BadRequest();

			context.Entry(transfer).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				transfer = await context.Transfers.FindAsync(id);

				if (transfer == null) return NotFound(); else throw;
			}

			return Ok(transfer);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTransfer([FromRoute] int id)
		{
			Transfer transfer = await context.Transfers.FindAsync(id);

			if (transfer == null) { return NotFound(); }

			context.Transfers.Remove(transfer);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
