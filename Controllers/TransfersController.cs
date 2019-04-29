using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Transfers.Models;

namespace Transfers.Controllers
{
	[Route("api/[controller]")]
	public class TransfersController : ControllerBase
	{
		private readonly Context context;

		public TransfersController(Context context)
		{
			this.context = context;
		}

		[HttpGet]
		public async Task<IEnumerable<Transfer>> Get()
		{
			return await context.Transfers.Include(x => x.Customer).ToListAsync();
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
