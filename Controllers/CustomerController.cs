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
	public class CustomerController : ControllerBase
	{
		private readonly Context context;

		public CustomerController(Context context)
		{
			this.context = context;
		}

		// GET: api/customer
		[HttpGet]
		public async Task<IEnumerable<Customer>> Get()
		{
			return await context.Customers.OrderBy(o => o.Description).ToListAsync();
		}

		// GET: api/customer/5
		[HttpGet("{id}")]
		public async Task<IActionResult> Getcustomer(int id)
		{
			Customer customer = await context.Customers.FindAsync(id);

			if (customer == null) { return NotFound(); }

			return Ok(customer);
		}

		// POST: api/customer
		[HttpPost]
		public async Task<IActionResult> Postcustomer([FromBody] Customer customer)
		{
			if (ModelState.IsValid)
			{
				context.Customers.Add(customer);
				await context.SaveChangesAsync();

				return Ok(customer);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		// PUT: api/customer/5
		[HttpPut("{id}")]
		public async Task<IActionResult> Putcustomer([FromRoute] int id, [FromBody] Customer customer)
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
				Customer item = await context.Customers.FindAsync(id);

				if (item == null) return NotFound(); else throw;
			}

			return Ok(customer);
		}

		// DELETE: api/customer/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> Deletecustomer([FromRoute] int id)
		{
			Customer customer = await context.Customers.FindAsync(id);

			if (customer == null) { return NotFound(); }

			context.Customers.Remove(customer);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
