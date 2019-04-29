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
	public class DestinationsController : ControllerBase
	{
		private readonly Context context;

		public DestinationsController(Context context)
		{
			this.context = context;
		}

		[HttpGet]
		public async Task<IEnumerable<Destination>> Get()
		{
			return await context.Destinations.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetCountry(int id)
		{
			Destination destination = await context.Destinations.FindAsync(id);

			if (destination == null) { return NotFound(); }

			return Ok(destination);
		}

		[HttpPost]
		public async Task<IActionResult> PostCountry([FromBody] Destination destination)
		{
			if (ModelState.IsValid)
			{
				context.Destinations.Add(destination);
				await context.SaveChangesAsync();

				return Ok(destination);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutCountry([FromRoute] int id, [FromBody] Destination destination)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != destination.Id) return BadRequest();

			context.Entry(destination).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				destination = await context.Destinations.FindAsync(id);

				if (destination == null) return NotFound(); else throw;
			}

			return Ok(destination);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteCountry([FromRoute] int id)
		{
			Destination destination = await context.Destinations.FindAsync(id);

			if (destination == null) { return NotFound(); }

			context.Destinations.Remove(destination);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
