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
        private readonly ApplicationDbContext context;

        public PickupPointsController(IMapper mapper, ApplicationDbContext context)
        {
            this.mapper = mapper;
            this.context = context;
        }

        [HttpGet("route/{routeId}")]
        public async Task<IEnumerable<PickupPoint>> Get(int routeId)
        {
            return await context.PickupPoints.Include(x => x.Route).Where(m => m.RouteId == routeId).OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPickupPoint(int id)
        {
            PickupPoint pickupPoint = await context.PickupPoints.Include(x => x.Route).AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);

            if (pickupPoint == null) return NotFound();

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
                pickupPoint = await context.PickupPoints.SingleOrDefaultAsync(m => m.Id == id);

                if (pickupPoint == null) return NotFound(); else throw;
            }

            return Ok(pickupPoint);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePickupPoint([FromRoute] int id)
        {
            PickupPoint pickupPoint = await context.PickupPoints.SingleOrDefaultAsync(m => m.Id == id);

            if (pickupPoint == null) return NotFound();

            context.PickupPoints.Remove(pickupPoint);

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
