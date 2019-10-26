using AutoMapper;
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
    // [Authorize(Policy = "RequireLoggedIn")]
    public class PickupPointsController : ControllerBase
    {
        // Variables
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        // Constructor
        public PickupPointsController(IMapper mapper, ApplicationDbContext context)
        {
            this.mapper = mapper;
            this.context = context;
        }

        // GET: api/pickupPoints
        [HttpGet]
        public async Task<IEnumerable<PickupPoint>> GetAll()
        {
            return await context.PickupPoints.Include(x => x.Route).ThenInclude(x => x.Port).OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        // GET: api/pickupPoints/pickupPointsForRoute/5
        [HttpGet("pickupPointsForRoute/{routeId}")]
        public async Task<IEnumerable<PickupPoint>> Get(int routeId)
        {
            return await context.PickupPoints.Include(x => x.Route).Where(m => m.RouteId == routeId).OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        // GET: api/pickupPoints/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPickupPoint(int id)
        {
            PickupPoint pickupPoint = await context.PickupPoints.Include(x => x.Route).AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);

            if (pickupPoint == null) return NotFound();

            return Ok(pickupPoint);
        }

        // POST: api/pickupPoints
        [HttpPost]
        public async Task<IActionResult> PostPickupPoint([FromBody] PickupPoint pickupPoint)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            context.PickupPoints.Add(pickupPoint);

            await context.SaveChangesAsync();

            return Ok(pickupPoint);
        }

        // PUT: api/pickupPoints/5
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

        // DELETE: api/pickupPoints/5
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