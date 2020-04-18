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
    public class CustomersController : ControllerBase {

        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        public CustomersController(IMapper mapper, ApplicationDbContext context) =>
            (this.mapper, this.context) = (mapper, context);

        [HttpGet]
        public async Task<IEnumerable<Customer>> Get() {
            return await context.Customers.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id) {
            Customer customer = await context.Customers.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id);
            if (customer == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> PostCustomer([FromBody] Customer customer) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            context.Customers.Add(customer);
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer([FromRoute] int id, [FromBody] Customer customer) {
            if (id != customer.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            if (await context.Customers.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            context.Entry(customer).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer([FromRoute] int id) {
            if (await context.Customers.AsNoTracking().SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            context.Customers.Remove(await context.Customers.SingleOrDefaultAsync(m => m.Id == id));
            try {
                await context.SaveChangesAsync();
                return Ok(new { response = ApiMessages.RecordDeleted() });
            } catch (DbUpdateException) {
                return BadRequest(new { response = ApiMessages.RecordInUse() });
            }
        }

    }

}