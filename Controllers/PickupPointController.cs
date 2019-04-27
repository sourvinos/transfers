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
	public class PickupPointController : ControllerBase
	{
		private readonly Context context;

		public PickupPointController(Context context)
		{
			this.context = context;
		}

		// GET: api/pickupPoint
		[HttpGet]
		public async Task<IEnumerable<PickupPoint>> Get()
		{
			return await context.PickupPoints.OrderBy(o => o.Description).ToListAsync();
		}

		// GET: api/pickupPoint/5
		[HttpGet("{id}")]
		public async Task<IActionResult> GetPickupPoint(int id)
		{
			PickupPoint pickupPoint = await context.PickupPoints.SingleOrDefaultAsync(m => m.PickupPointId == id);

			if (pickupPoint == null) { return NotFound(); }

			return Ok(pickupPoint);
		}

		// POST: api/pickupPoint
		[HttpPost]
		public async Task<IActionResult> PostPickupPoint([FromBody] PickupPoint pickupPoint)
		{
			if (ModelState.IsValid)
			{
				context.PickupPoints.Add(pickupPoint);
				await context.SaveChangesAsync();

				return Ok(pickupPoint);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		// PUT: api/pickupPoint/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutPickupPoint([FromRoute] int id, [FromBody] PickupPoint pickupPoint)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != pickupPoint.PickupPointId) return BadRequest();

			context.Entry(pickupPoint).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				pickupPoint = await context.PickupPoints.FindAsync(id);

				if (pickupPoint == null) return NotFound(); else throw;
			}

			return Ok(pickupPoint);
		}

		// DELETE: api/pickupPoint/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeletepickupPoint([FromRoute] int id)
		{
			PickupPoint pickupPoint = await context.PickupPoints.FindAsync(id);

			if (pickupPoint == null) { return NotFound(); }

			context.PickupPoints.Remove(pickupPoint);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
