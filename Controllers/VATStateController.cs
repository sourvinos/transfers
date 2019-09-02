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
    public class VATStatesController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        public VATStatesController(IMapper mapper, ApplicationDbContext context)
        {
            this.mapper = mapper;
            this.context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<VATState>> Get()
        {
            return await context.VATStates.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVATState(int id)
        {
            VATState vatState = await context.VATStates.SingleOrDefaultAsync(m => m.Id == id);

            if (vatState == null) return NotFound();

            return Ok(vatState);
        }

        [HttpPost]
        public async Task<IActionResult> PostVATState([FromBody] VATState vatState)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            context.VATStates.Add(vatState);

            await context.SaveChangesAsync();

            return Ok(vatState);
        }

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
