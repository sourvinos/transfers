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
	public class TaxOfficesController : ControllerBase
	{
		private readonly IMapper mapper;
		private readonly Context context;

		public TaxOfficesController(IMapper mapper, Context context)
		{
			this.mapper = mapper;
			this.context = context;
		}

		[HttpGet]
		public async Task<IEnumerable<TaxOffice>> Get()
		{
			return await context.TaxOffices.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetTaxOffice(int id)
		{
			TaxOffice taxOffice = await context.TaxOffices.SingleOrDefaultAsync(m => m.Id == id);

			if (taxOffice == null) return NotFound();

			return Ok(taxOffice);
		}

		[HttpPost]
		public async Task<IActionResult> PostTaxOffice([FromBody] TaxOffice taxOffice)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			context.TaxOffices.Add(taxOffice);

			await context.SaveChangesAsync();

			return Ok(taxOffice);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutTaxOffice([FromRoute] int id, [FromBody] TaxOffice taxOffice)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != taxOffice.Id) return BadRequest();

			context.Entry(taxOffice).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				taxOffice = await context.TaxOffices.SingleOrDefaultAsync(m => m.Id == id);

				if (taxOffice == null) return NotFound(); else throw;
			}

			return Ok(taxOffice);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTaxOffice([FromRoute] int id)
		{
			TaxOffice taxOffice = await context.TaxOffices.SingleOrDefaultAsync(m => m.Id == id);

			if (taxOffice == null) { return NotFound(); }

			context.TaxOffices.Remove(taxOffice);

			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
