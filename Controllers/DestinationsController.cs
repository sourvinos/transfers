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

        // Variables
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        // Constructor
        public DestinationsController(IMapper mapper, ApplicationDbContext context) {

            this.mapper = mapper;
            this.context = context;

        }

        // GET: api/destinations
        [HttpGet]
        public async Task<IEnumerable<Destination>> Get() {

            return await context.Destinations.OrderBy(o => o.Description).AsNoTracking().ToListAsync();

        }

        // GET: api/destinations/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDestination(int id) {

            Destination destination = await context.Destinations.SingleOrDefaultAsync(m => m.Id == id);;

            if (destination == null) return NotFound();

            return Ok(destination);

        }

        // POST: api/destinations
        [HttpPost]
        public async Task<IActionResult> PostDestination([FromBody] Destination destination) {

            if (!ModelState.IsValid) return BadRequest();

            context.Destinations.Add(destination);

            await context.SaveChangesAsync();

            return Ok(destination);

        }

        // PUT: api/destinations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDestination([FromRoute] int id, [FromBody] Destination destination) {

            if (!ModelState.IsValid) return BadRequest();
            if (id != destination.Id) return BadRequest();

            context.Entry(destination).State = EntityState.Modified;

            try {
                await context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                destination = await context.Destinations.SingleOrDefaultAsync(m => m.Id == id);
                if (destination == null) return NotFound();
            }

            return Ok(destination);

        }

        // DELETE: api/destinations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDestination([FromRoute] int id) {

            Destination destination = await context.Destinations.SingleOrDefaultAsync(m => m.Id == id);

            if (destination == null) { return NotFound(); }

            context.Destinations.Remove(destination);

            await context.SaveChangesAsync();

            return NoContent();

        }

    }

}