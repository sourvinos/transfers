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
	public class CustomersController : ControllerBase
	{
		private readonly IMapper mapper;
		private readonly Context context;

		public CustomersController(IMapper mapper, Context context)
		{
			this.mapper = mapper;
			this.context = context;
		}

		[HttpGet]
		public async Task<IEnumerable<Customer>> Get()
		{
			return await context.Customers.Include(x => x.TaxOffice).Include(x => x.VATState).OrderBy(o => o.Description).AsNoTracking().ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetCustomer(int id)
		{
			Customer customer = await context.Customers.Include(x => x.TaxOffice).Include(x => x.VATState).SingleOrDefaultAsync(m => m.Id == id);

			if (customer == null) return NotFound();

			return Ok(customer);
		}

		[HttpPost]
		public async Task<IActionResult> PostCustomer([FromBody] Customer customer)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			context.Customers.Add(customer);

			await context.SaveChangesAsync();

			return Ok(customer);
		}

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
