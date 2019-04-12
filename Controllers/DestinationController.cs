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
	public class DestinationController : ControllerBase
	{
		private readonly Context context;

		public DestinationController(Context context)
		{
			this.context = context;
		}

		// GET: api/destination
		[HttpGet]
		public async Task<IEnumerable<Destination>> Get()
		{
			return await context.Destinations.OrderBy(o => o.Description).ToListAsync();
		}

		// GET: api/destination/5
		[HttpGet("{id}")]
		public async Task<IActionResult> GetCountry(int id)
		{
			Destination destination = await context.Destinations.FindAsync(id);

			if (destination == null) { return NotFound(); }

			return Ok(destination);
		}

		// POST: api/destination
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

		// PUT: api/destination/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutCountry([FromRoute] int id, [FromBody] Destination destination)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != destination.DestinationId) return BadRequest();

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

		// DELETE: api/destination/5
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
