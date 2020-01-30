using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RazorLight;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Transfers.Models;

namespace Transfers.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]
    public class PortsController : ControllerBase
    {
        // Variables
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;
        private readonly IRazorLightEngine razorEngine;

        // Constructor
        public PortsController(IMapper mapper, ApplicationDbContext context, IRazorLightEngine razorEngine)
        {
            this.mapper = mapper;
            this.context = context;
            this.razorEngine = razorEngine;
        }

        // GET: api/ports
        [HttpGet]
        public async Task<IEnumerable<Port>> Get()
        {
            return await context.Ports.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        // GET: api/ports/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPort(int id)
        {
            Port port = await context.Ports.SingleOrDefaultAsync(m => m.Id == id);

            if (port == null) return NotFound();

            return Ok(port);
        }

        // POST: api/ports
        [HttpPost]
        public async Task<IActionResult> PostPort([FromBody] Port port)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            context.Ports.Add(port);

            await context.SaveChangesAsync();

            return Ok(port);
        }

        // PUT: api/ports/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPort([FromRoute] int id, [FromBody] Port port)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id != port.Id) return BadRequest();

            context.Entry(port).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                port = await context.Ports.SingleOrDefaultAsync(m => m.Id == id);

                if (port == null) return NotFound(); else throw;
            }

            return Ok(port);
        }

        // DELETE: api/ports/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePort([FromRoute] int id)
        {
            Port port = await context.Ports.SingleOrDefaultAsync(m => m.Id == id);

            if (port == null) { return NotFound(); }

            context.Ports.Remove(port);

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}