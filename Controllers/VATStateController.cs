using Transfers.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Transfers.Controllers
{
	[Route("api/[controller]")]
	public class VATStateController : ControllerBase
	{
		private readonly Context context;

		public VATStateController(Context context)
		{
			this.context = context;
		}

		// GET: api/vatState
		[HttpGet]
		public async Task<IEnumerable<VATState>> Get()
		{
			return await context.VATStates.OrderBy(o => o.Description).ToListAsync();
		}

		// GET: api/vatState/5
		[HttpGet("{id}")]
		public async Task<IActionResult> GetVATState(int id)
		{
			VATState item = await context.VATStates.FindAsync(id);

			if (item == null) { return NotFound(); }

			return Ok(item);
		}

		// POST: api/vatState
		[HttpPost]
		public async Task<IActionResult> PostVATState([FromBody] VATState item)
		{
			if (ModelState.IsValid)
			{
				context.VATStates.Add(item);
				await context.SaveChangesAsync();

				return Ok(item);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		// PUT: api/vatState/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutVATState([FromRoute] int id, [FromBody] VATState item)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != item.VATStateId) return BadRequest();

			context.Entry(item).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				item = await context.VATStates.FindAsync(id);

				if (item == null) return NotFound(); else throw;
			}

			return Ok(item);
		}

		// DELETE: api/vatState/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteVATState([FromRoute] int id)
		{
			VATState item = await context.VATStates.FindAsync(id);

			if (item == null) { return NotFound(); }

			context.VATStates.Remove(item);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
