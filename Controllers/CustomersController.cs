using System;
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
            Customer customer = await context.Customers.SingleOrDefaultAsync(m => m.Id == id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> PostCustomer([FromBody] Customer customer) {
            if (ModelState.IsValid) {
                context.Customers.Add(customer);
                await context.SaveChangesAsync();
                return Ok(customer);
            }
            return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer([FromRoute] int id, [FromBody] Customer customer) {
            if (id != customer.Id) return BadRequest(new { response = "Unexpected Id" });
            if (ModelState.IsValid) {
                try {
                    context.Entry(customer).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                    return Ok(customer);
                } catch (DbUpdateConcurrencyException) {
                    if (await context.Customers.SingleOrDefaultAsync(m => m.Id == id) == null) return NotFound();
                }
            }
            return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer([FromRoute] int id) {
            try {
                context.Customers.Remove(await context.Customers.SingleOrDefaultAsync(m => m.Id == id));
                await context.SaveChangesAsync();
                return Ok(new { response = "Record deleted" });
            } catch (Exception) {
                return BadRequest(new { response = "Unable to delete this record" });
            }
        }

    }

}