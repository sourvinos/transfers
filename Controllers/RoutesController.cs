using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Transfers.Models;

namespace Transfers.Controllers
{
	[Route("api/[controller]")]
	public class RoutesController : ControllerBase
	{
		private readonly Context context;

		public RoutesController(Context context)
		{
			this.context = context;
		}

		[HttpGet]
		public async Task<IEnumerable<Route>> Get()
		{
			IEnumerable<Route> items = await context.Routes.Include(x => x.PickupPoints).OrderBy(o => o.Description).AsNoTracking().ToListAsync();

			return items;
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetRoute(int id)
		{
			Route item = await context.Routes.FindAsync(id);

			if (item == null) return NotFound();

			return Ok(item);
		}

		[HttpPost]
		public async Task<IActionResult> PostRoute([FromBody] Route coachRoute)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			context.Routes.Add(coachRoute);

			await context.SaveChangesAsync();

			Route item = await context.Routes.FindAsync(coachRoute.Id);

			return Ok(item);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutRoute(int id, [FromBody] Route coachRoute)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != coachRoute.Id) return BadRequest();

			context.Entry(coachRoute).State = EntityState.Modified;

			await context.SaveChangesAsync();

			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteRoute([FromRoute] int id)
		{
			Route item = await context.Routes.SingleAsync(x => x.Id == id);

			if (item == null) return NotFound();

			context.Routes.Remove(item);

			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
