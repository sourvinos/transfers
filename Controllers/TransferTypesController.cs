using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Transfers.Models;

namespace Transfers.Controllers
{
	[Route("api/[controller]")]
	public class TransferTypesController : ControllerBase
	{
		private readonly IMapper mapper;
		private readonly Context context;

		public TransferTypesController(IMapper mapper, Context context)
		{
			this.mapper = mapper;
			this.context = context;
		}

		[HttpGet]
		public async Task<IEnumerable<TransferType>> Get()
		{
			return await context.TransferTypes.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetTransferType(int id)
		{
			TransferType transferType = await context.TransferTypes.SingleOrDefaultAsync(m => m.Id == id);

			if (transferType == null) return NotFound();

			return Ok(transferType);
		}

		[HttpPost]
		public async Task<IActionResult> PostTransferType([FromBody] TransferType transferType)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			context.TransferTypes.Add(transferType);

			await context.SaveChangesAsync();

			return Ok(transferType);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutTransferType([FromRoute] int id, [FromBody] TransferType transferType)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != transferType.Id) return BadRequest();

			context.Entry(transferType).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				transferType = await context.TransferTypes.SingleOrDefaultAsync(m => m.Id == id);

				if (transferType == null) return NotFound(); else throw;
			}

			return Ok(transferType);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTransferType([FromRoute] int id)
		{
			TransferType transferType = await context.TransferTypes.SingleOrDefaultAsync(m => m.Id == id);

			if (transferType == null) return NotFound();

			context.TransferTypes.Remove(transferType);

			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
