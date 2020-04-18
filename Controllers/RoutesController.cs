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
    public class RoutesController : ControllerBase {

        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        public RoutesController(IMapper mapper, ApplicationDbContext context) =>
            (this.mapper, this.context) = (mapper, context);

        [HttpGet]
        public async Task<IEnumerable<Route>> Get() {
            return await context.Routes.Include(x => x.Port).OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoute(int id) {
            Route route = await context.Routes.Include(x => x.Port).SingleOrDefaultAsync(m => m.Id == id);
            if (route == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(route);
        }

        [HttpPost]
        public async Task<IActionResult> PostRoute([FromBody] Route route) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            context.Routes.Add(route);
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoute(int id, [FromBody] Route route) {
            if (id != route.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            if (await context.Routes.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            context.Entry(route).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoute([FromRoute] int id) {
            if (await context.Routes.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            context.Routes.Remove(await context.Routes.SingleOrDefaultAsync(m => m.Id == id));
            try {
                await context.SaveChangesAsync();
                return Ok(new { response = ApiMessages.RecordDeleted() });
            } catch (DbUpdateException) {
                return BadRequest(new { response = ApiMessages.RecordInUse() });
            }
        }

    }

}