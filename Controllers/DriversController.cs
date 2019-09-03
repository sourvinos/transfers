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
    public class DriversController : ControllerBase
    {
        // Variables
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        // Constructor
        public DriversController(IMapper mapper, ApplicationDbContext context)
        {
            this.mapper = mapper;
            this.context = context;
        }

        // GET: api/drivers
        [HttpGet]
        public async Task<IEnumerable<Driver>> Get()
        {
            return await context.Drivers.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        // GET: api/drivers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDriver(int id)
        {
            Driver driver = await context.Drivers.SingleOrDefaultAsync(m => m.Id == id);

            if (driver == null) return NotFound();

            return Ok(driver);
        }

        // POST: api/drivers
        [HttpPost]
        public async Task<IActionResult> PostDriver([FromBody] Driver driver)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            context.Drivers.Add(driver);

            await context.SaveChangesAsync();

            return Ok(driver);
        }

        // PUT: api/drivers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDriver([FromRoute] int id, [FromBody] Driver driver)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id != driver.Id) return BadRequest();

            context.Entry(driver).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                driver = await context.Drivers.SingleOrDefaultAsync(m => m.Id == id);

                if (driver == null) return NotFound(); else throw;
            }

            return Ok(driver);
        }

        // DELETE: api/drivers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver([FromRoute] int id)
        {
            Driver driver = await context.Drivers.SingleOrDefaultAsync(m => m.Id == id);

            if (driver == null) { return NotFound(); }

            context.Drivers.Remove(driver);

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}