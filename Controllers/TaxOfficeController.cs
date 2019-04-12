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
	public class TaxOfficeController : ControllerBase
	{
		private readonly Context context;

		public TaxOfficeController(Context context)
		{
			this.context = context;
		}

		// GET: api/taxOffice
		[HttpGet]
		public async Task<IEnumerable<TaxOffice>> Get()
		{
			return await context.TaxOffices.OrderBy(o => o.Description).ToListAsync();
		}

		// GET: api/taxOffice/5
		[HttpGet("{id}")]
		public async Task<IActionResult> GetTaxOffice(int id)
		{
			TaxOffice taxOffice = await context.TaxOffices.FindAsync(id);

			if (taxOffice == null) { return NotFound(); }

			return Ok(taxOffice);
		}

		// POST: api/taxOffice
		[HttpPost]
		public async Task<IActionResult> PostTaxOffice([FromBody] TaxOffice taxOffice)
		{
			if (ModelState.IsValid)
			{
				context.TaxOffices.Add(taxOffice);
				await context.SaveChangesAsync();

				return Ok(taxOffice);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		// PUT: api/taxOffice/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutTaxOffice([FromRoute] int id, [FromBody] TaxOffice taxOffice)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != taxOffice.TaxOfficeId) return BadRequest();

			context.Entry(taxOffice).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				taxOffice = await context.TaxOffices.FindAsync(id);

				if (taxOffice == null) return NotFound(); else throw;
			}

			return Ok(taxOffice);
		}

		// DELETE: api/taxOffice/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTaxOffice([FromRoute] int id)
		{
			TaxOffice taxOffice = await context.TaxOffices.FindAsync(id);

			if (taxOffice == null) { return NotFound(); }

			context.TaxOffices.Remove(taxOffice);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
