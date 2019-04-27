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
			VATState vatState = await context.VATStates.FindAsync(id);

			if (vatState == null) { return NotFound(); }

			return Ok(vatState);
		}

		// POST: api/vatState
		[HttpPost]
		public async Task<IActionResult> PostVATState([FromBody] VATState vatState)
		{
			if (ModelState.IsValid)
			{
				context.VATStates.Add(vatState);
				await context.SaveChangesAsync();

				return Ok(vatState);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		// PUT: api/vatState/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutVATState([FromRoute] int id, [FromBody] VATState vatState)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != vatState.VATStateId) return BadRequest();

			context.Entry(vatState).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				vatState = await context.VATStates.FindAsync(id);

				if (vatState == null) return NotFound(); else throw;
			}

			return Ok(vatState);
		}

		// DELETE: api/vatState/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteVATState([FromRoute] int id)
		{
			VATState vatState = await context.VATStates.FindAsync(id);

			if (vatState == null) { return NotFound(); }

			context.VATStates.Remove(vatState);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
