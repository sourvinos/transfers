using AutoMapper;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Transfers.Models;
using Transfers.Utils;

namespace Transfers.Controllers
{
    [Route("api/[controller]")]
    // [Authorize(Policy = "RequireLoggedIn")]
    public class CustomersController : ControllerBase
    {
        // Variables
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;
        private readonly IConverter converter;

        // Constructor
        public CustomersController(IMapper mapper, ApplicationDbContext context, IConverter converter)
        {
            this.mapper = mapper;
            this.context = context;
            this.converter = converter;
        }

        // GET: api/customers
        [HttpGet]
        public async Task<IEnumerable<Customer>> Get()
        {
            return await context.Customers.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        // GET: api/customers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            Customer customer = await context.Customers.SingleOrDefaultAsync(m => m.Id == id);

            if (customer == null) return NotFound();

            return Ok(customer);
        }

        // POST: api/customers
        [HttpPost]
        public async Task<IActionResult> PostCustomer([FromBody] Customer customer)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            context.Customers.Add(customer);

            await context.SaveChangesAsync();

            return Ok(customer);
        }

        // PUT: api/customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer([FromRoute] int id, [FromBody] Customer customer)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id != customer.Id) return BadRequest();

            context.Entry(customer).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                customer = await context.Customers.SingleOrDefaultAsync(m => m.Id == id);

                if (customer == null) return NotFound(); else throw;
            }

            return Ok(customer);
        }

        // DELETE: api/customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer([FromRoute] int id)
        {
            Customer customer = await context.Customers.SingleOrDefaultAsync(m => m.Id == id);

            if (customer == null) { return NotFound(); }

            context.Customers.Remove(customer);

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}