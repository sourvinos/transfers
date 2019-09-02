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
    public class DestinationsController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        public DestinationsController(IMapper mapper, ApplicationDbContext context)
        {
            this.mapper = mapper;
            this.context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Destination>> Get()
        {
            return await context.Destinations.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDestination(int id)
        {
            Destination destination = await context.Destinations.SingleOrDefaultAsync(m => m.Id == id); ;

            if (destination == null) return NotFound();

            return Ok(destination);
        }

        [HttpPost]
        public async Task<IActionResult> PostDestination([FromBody] Destination destination)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            context.Destinations.Add(destination);

            await context.SaveChangesAsync();

            return Ok(destination);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDestination([FromRoute] int id, [FromBody] Destination destination)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id != destination.Id) return BadRequest();

            context.Entry(destination).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                destination = await context.Destinations.SingleOrDefaultAsync(m => m.Id == id);

                if (destination == null) return NotFound(); else throw;
            }

            return Ok(destination);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDestination([FromRoute] int id)
        {
            Destination destination = await context.Destinations.SingleOrDefaultAsync(m => m.Id == id);

            if (destination == null) { return NotFound(); }

            context.Destinations.Remove(destination);

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}