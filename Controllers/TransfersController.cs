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

		[HttpGet("filterOnDate/{dateIn}")]
		public async Task<IEnumerable<TransferResource>> getTransfers(DateTime? dateIn)
		{
			List<Transfer> transfers = await context.Transfers
				.Include(x => x.Customer)
				.Include(x => x.TransferType)
				.Include(x => x.PickupPoint)
					.ThenInclude(x => x.Route)
				.Include(x => x.Destination)
				.Where(x => x.DateIn == dateIn).ToListAsync();

			return mapper.Map<IEnumerable<Transfer>, IEnumerable<TransferResource>>(transfers);
		}

		[HttpGet("{id}")]
		public async Task<TransferResource> GetTransfer(int id)
		{
			Transfer transfer = await context.Transfers
				.Include(x => x.Customer)
				.Include(x => x.TransferType)
				.Include(x => x.PickupPoint)
					.ThenInclude(x => x.Route)
				.Include(x => x.Destination)
				.SingleOrDefaultAsync(m => m.Id == id);

			return mapper.Map<Transfer, TransferResource>(transfer);
		}

		[HttpPost]
		public async Task<IActionResult> PostTransfer([FromBody] Transfer transfer)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			context.Transfers.Add(transfer);

			await context.SaveChangesAsync();

			return Ok(transfer);
		}

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

			var item = await context.Transfers.SingleOrDefaultAsync(m => m.Id == id);

			var result = mapper.Map<Transfer, SaveTransferResource>(item);

			return Ok(result);
		}

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
