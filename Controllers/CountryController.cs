using Transfers.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Transfers.Controllers
{
	[Route("api/[controller]")]
	public class CountryController : ControllerBase
	{
		private readonly Context context;

		public CountryController(Context context)
		{
			this.context = context;
		}

		// GET: api/country
		[HttpGet]
		public async Task<IEnumerable<Country>> Get()
		{
			return await context.Countries.OrderBy(o => o.Description).ToListAsync();
		}

		// GET: api/country/5
		[HttpGet("{id}")]
		public async Task<IActionResult> GetCountry(int id)
		{
			Country country = await context.Countries.FindAsync(id);

			if (country == null) { return NotFound(); }

			return Ok(country);
		}

		// POST: api/country
		[HttpPost]
		public async Task<IActionResult> PostCountry([FromBody] Country country)
		{
			if (ModelState.IsValid)
			{
				context.Countries.Add(country);
				await context.SaveChangesAsync();

				return Ok(country);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		// PUT: api/country/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutCountry([FromRoute] int id, [FromBody] Country country)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != country.CountryId) return BadRequest();

			context.Entry(country).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				Country item = await context.Countries.FindAsync(id);

				if (item == null) return NotFound(); else throw;
			}

			return Ok(country);
		}

		// DELETE: api/country/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteCountry([FromRoute] int id)
		{
			Country country = await context.Countries.FindAsync(id);

			if (country == null) { return NotFound(); }

			context.Countries.Remove(country);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
