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
    public class DestinationsController : ControllerBase {

        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        public DestinationsController(IMapper mapper, ApplicationDbContext context) =>
            (this.mapper, this.context) = (mapper, context);

        [HttpGet]
        public async Task<IEnumerable<Destination>> Get() {
            return await context.Destinations.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDestination(int id) {
            Destination destination = await context.Destinations.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);
            if (destination == null) return NotFound(new { Response = ApiMessages.RecordNotFound() });
            return Ok(destination);
        }

        [HttpPost]
        public async Task<IActionResult> PostDestination([FromBody] Destination destination) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            context.Destinations.Add(destination);
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDestination([FromRoute] int id, [FromBody] Destination destination) {
            if (id != destination.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            if (await context.Destinations.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { Response = ApiMessages.RecordNotFound() });
            context.Entry(destination).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDestination([FromRoute] int id) {
            if (await context.Destinations.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            context.Destinations.Remove(await context.Destinations.SingleOrDefaultAsync(m => m.Id == id));
            try {
                await context.SaveChangesAsync();
                return Ok(new { response = ApiMessages.RecordDeleted() });
            } catch (DbUpdateException) {
                return BadRequest(new { response = ApiMessages.RecordInUse() });
            }
        }

    }

}