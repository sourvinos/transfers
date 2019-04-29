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
	public class PickupPointsController : ControllerBase
	{
		private readonly IMapper mapper;
		private readonly Context context;

		public PickupPointsController(IMapper mapper, Context context)
		{
			this.mapper = mapper;
			this.context = context;
		}

		[HttpGet]
		public async Task<IEnumerable<PickupPoint>> Get()
		{
			return await context.PickupPoints.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetPickupPoint(int id)
		{
			var pickupPoint = await context.PickupPoints.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);

			if (pickupPoint == null) { return NotFound(); }

			return Ok(pickupPoint);
		}

		[HttpPost]
		public async Task<IActionResult> PostPickupPoint([FromBody] PickupPoint pickupPoint)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			context.PickupPoints.Add(pickupPoint);

			await context.SaveChangesAsync();

			return Ok(pickupPoint);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutPickupPoint([FromRoute] int id, [FromBody] PickupPoint pickupPoint)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != pickupPoint.Id) return BadRequest();

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

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeletePickupPoint([FromRoute] int id)
		{
			PickupPoint pickupPoint = await context.PickupPoints.FindAsync(id);

			if (pickupPoint == null) return NotFound();

			context.PickupPoints.Remove(pickupPoint);

			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
