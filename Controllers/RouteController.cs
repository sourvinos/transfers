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
	public class RouteController : ControllerBase
	{
		private readonly Context context;

		public RouteController(Context context)
		{
			this.context = context;
		}

		// GET: api/route
		[HttpGet]
		public async Task<IEnumerable<Route>> Get()
		{
			return await context.Routes.OrderBy(o => o.Description).ToListAsync();
		}

		// GET: api/route/5
		[HttpGet("{id}")]
		public async Task<IActionResult> GetRoute(int id)
		{
			Route route = await context.Routes.FindAsync(id);

			if (route == null) { return NotFound(); }

			return Ok(route);
		}

		// POST: api/route
		[HttpPost]
		public async Task<IActionResult> PostRoute([FromBody] Route route)
		{
			if (ModelState.IsValid)
			{
				context.Routes.Add(route);
				await context.SaveChangesAsync();

				return Ok(route);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		// PUT: api/route/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutRoute([FromRoute] int id, [FromBody] Route route)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != route.RouteId) return BadRequest();

			context.Entry(route).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				route = await context.Routes.FindAsync(id);

				if (route == null) return NotFound(); else throw;
			}

			return Ok(route);
		}

		// DELETE: api/route/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteRoute([FromRoute] int id)
		{
			Route route = await context.Routes.FindAsync(id);

			if (route == null) { return NotFound(); }

			context.Routes.Remove(route);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
