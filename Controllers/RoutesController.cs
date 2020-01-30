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
    [Authorize(Policy = "RequireLoggedIn")]
    public class RoutesController : ControllerBase
    {
        // Variables
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        // Constructor
        public RoutesController(IMapper mapper, ApplicationDbContext context)
        {
            this.mapper = mapper;
            this.context = context;
        }

        // GET: api/routes
        [HttpGet]
        public async Task<IEnumerable<Route>> Get()
        {
            return await context.Routes.Include(x => x.Port).OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        // GET: api/routes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoute(int id)
        {
            Route route = await context.Routes.Include(x => x.Port).SingleOrDefaultAsync(m => m.Id == id);

            if (route == null) return NotFound();

            return Ok(route);
        }

        // POST: api/routes
        [HttpPost]
        public async Task<IActionResult> PostRoute([FromBody] Route route)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            context.Routes.Add(route);

            await context.SaveChangesAsync();

            return Ok(route);
        }

        // PUT: api/routes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoute(int id, [FromBody] Route route)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id != route.Id) return BadRequest();

            context.Entry(route).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                route = await context.Routes.SingleOrDefaultAsync(m => m.Id == id);

                if (route == null) return NotFound(); else throw;
            }

            return Ok(route);

        }

        // DELETE: api/routes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoute([FromRoute] int id)
        {
            Route route = await context.Routes.SingleOrDefaultAsync(m => m.Id == id);

            if (route == null) return NotFound();

            context.Routes.Remove(route);

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}