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
    public class DriversController : ControllerBase {

        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        public DriversController(IMapper mapper, ApplicationDbContext context) =>
            (this.mapper, this.context) = (mapper, context);

        [HttpGet]
        public async Task<IEnumerable<Driver>> Get() {
            return await context.Drivers.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDriver(int id) {
            Driver driver = await context.Drivers.SingleOrDefaultAsync(m => m.Id == id);
            if (driver == null) return NotFound(new { Response = ApiMessages.RecordNotFound() });
            return Ok(driver);
        }

        [HttpPost]
        public async Task<IActionResult> PostDriver([FromBody] Driver driver) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            context.Drivers.Add(driver);
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDriver([FromRoute] int id, [FromBody] Driver driver) {
            if (id != driver.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            if (await context.Drivers.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { Response = ApiMessages.RecordNotFound() });
            context.Entry(driver).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver([FromRoute] int id) {
            if (await context.Customers.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            context.Customers.Remove(await context.Customers.SingleOrDefaultAsync(m => m.Id == id));
            try {
                await context.SaveChangesAsync();
                return Ok(new { response = ApiMessages.RecordDeleted() });
            } catch (DbUpdateException) {
                return BadRequest(new { response = ApiMessages.RecordInUse() });
            }
        }

        [HttpGet("getDefault")]
        public async Task<IActionResult> GetDefaultDriver() {
            Driver driver = await context.Drivers.SingleOrDefaultAsync(m => m.IsDefault);
            return Ok(driver);
        }

    }

}