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
			TaxOffice item = await context.TaxOffices.FindAsync(id);

			if (item == null) { return NotFound(); }

			return Ok(item);
		}

		// POST: api/taxOffice
		[HttpPost]
		public async Task<IActionResult> PostTaxOffice([FromBody] TaxOffice item)
		{
			if (ModelState.IsValid)
			{
				context.TaxOffices.Add(item);
				await context.SaveChangesAsync();

				return Ok(item);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		// PUT: api/taxOffice/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutTaxOffice([FromRoute] int id, [FromBody] TaxOffice item)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != item.TaxOfficeId) return BadRequest();

			context.Entry(item).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				item = await context.TaxOffices.FindAsync(id);

				if (item == null) return NotFound(); else throw;
			}

			return Ok(item);
		}

		// DELETE: api/taxOffice/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTaxOffice([FromRoute] int id)
		{
			TaxOffice item = await context.TaxOffices.FindAsync(id);

			if (item == null) { return NotFound(); }

			context.TaxOffices.Remove(item);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
