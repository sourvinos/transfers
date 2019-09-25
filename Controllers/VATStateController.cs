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
    // [Authorize(Policy = "RequireLoggedIn")]
    public class VATStatesController : ControllerBase
    {
        // Variables
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        // Constructor
        public VATStatesController(IMapper mapper, ApplicationDbContext context)
        {
            this.mapper = mapper;
            this.context = context;
        }

        // GET: api/vatStates
        [HttpGet]
        public async Task<IEnumerable<VATState>> Get()
        {
            return await context.VATStates.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        // GET: api/vatStates/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVATState(int id)
        {
            VATState vatState = await context.VATStates.SingleOrDefaultAsync(m => m.Id == id);

            if (vatState == null) return NotFound();

            return Ok(vatState);
        }

        // POST: api/vatStates
        [HttpPost]
        public async Task<IActionResult> PostVATState([FromBody] VATState vatState)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            context.VATStates.Add(vatState);

            await context.SaveChangesAsync();

            return Ok(vatState);
        }

        // PUT: api/vatStates/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVATState([FromRoute] int id, [FromBody] VATState vatState)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id != vatState.Id) return BadRequest();

            context.Entry(vatState).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                vatState = await context.VATStates.SingleOrDefaultAsync(m => m.Id == id);

                if (vatState == null) return NotFound(); else throw;
            }

            return Ok(vatState);
        }

        // DELETE: api/vatStates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVATState([FromRoute] int id)
        {
            VATState vatState = await context.VATStates.SingleOrDefaultAsync(m => m.Id == id);

            if (vatState == null) return NotFound();

            context.VATStates.Remove(vatState);

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}