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
	public class DriversController : ControllerBase
	{
		private readonly IMapper mapper;
		private readonly Context context;

		public DriversController(IMapper mapper, Context context)
		{
			this.mapper = mapper;
			this.context = context;
		}

		[HttpGet]
		public async Task<IEnumerable<Driver>> Get()
		{
			return await context.Drivers.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetDriver(int id)
		{
			Driver driver = await context.Drivers.SingleOrDefaultAsync(m => m.Id == id);

			if (driver == null) return NotFound();

			return Ok(driver);
		}

		[HttpPost]
		public async Task<IActionResult> PostDriver([FromBody] Driver driver)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			context.Drivers.Add(driver);

			await context.SaveChangesAsync();

			return Ok(driver);
		}

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
