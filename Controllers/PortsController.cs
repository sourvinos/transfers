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
    public class PortsController : ControllerBase {

        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        public PortsController(IMapper mapper, ApplicationDbContext context) =>
            (this.mapper, this.context) = (mapper, context);

        [HttpGet]
        public async Task<IEnumerable<Port>> Get() {
            return await context.Ports.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPort(int id) {
            Port port = await context.Ports.SingleOrDefaultAsync(m => m.Id == id);
            if (port == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(port);
        }

        [HttpPost]
        public async Task<IActionResult> PostPort([FromBody] Port port) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            context.Ports.Add(port);
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPort([FromRoute] int id, [FromBody] Port port) {
            if (id != port.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            if (await context.Ports.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            context.Entry(port).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePort([FromRoute] int id) {
            if (await context.Ports.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            context.Ports.Remove(await context.Ports.SingleOrDefaultAsync(m => m.Id == id));
            try {
                await context.SaveChangesAsync();
                return Ok(new { response = ApiMessages.RecordDeleted() });
            } catch (DbUpdateException) {
                return BadRequest(new { response = ApiMessages.RecordInUse() });
            }
        }

    }

}