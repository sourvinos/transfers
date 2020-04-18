using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]
    public class PickupPointsController : ControllerBase {

        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        public PickupPointsController(IMapper mapper, ApplicationDbContext context) =>
            (this.mapper, this.context) = (mapper, context);

        [HttpGet("routeId/{routeId}")]
        public async Task<IEnumerable<PickupPoint>> Get(int routeId) {
            return await context.PickupPoints.Include(x => x.Route).Where(m => m.RouteId == routeId).OrderBy(o => o.Time).ThenBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPickupPoint(int id) {
            PickupPoint pickupPoint = await context.PickupPoints.Include(x => x.Route).AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);
            if (pickupPoint == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(pickupPoint);
        }

        [HttpPost]
        public async Task<IActionResult> PostPickupPoint([FromBody] PickupPoint pickupPoint) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            context.PickupPoints.Add(pickupPoint);
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPickupPoint([FromRoute] int id, [FromBody] PickupPoint pickupPoint) {
            if (id != pickupPoint.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            if (await context.PickupPoints.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            context.Entry(pickupPoint).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePickupPoint([FromRoute] int id) {
            if (await context.PickupPoints.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            context.PickupPoints.Remove(await context.PickupPoints.SingleOrDefaultAsync(m => m.Id == id));
            try {
                await context.SaveChangesAsync();
                return Ok(new { response = ApiMessages.RecordDeleted() });
            } catch (DbUpdateException) {
                return BadRequest(new { response = ApiMessages.RecordInUse() });
            }
        }

    }

}