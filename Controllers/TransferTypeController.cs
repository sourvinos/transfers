﻿using Transfers.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Transfers.Controllers
{
	[Route("api/[controller]")]
	public class TransferTypeController : ControllerBase
	{
		private readonly Context context;

		public TransferTypeController(Context context)
		{
			this.context = context;
		}

		// GET: api/transferType
		[HttpGet]
		public async Task<IEnumerable<TransferType>> Get()
		{
			return await context.TransferTypes.OrderBy(o => o.Description).ToListAsync();
		}

		// GET: api/transferType/5
		[HttpGet("{id}")]
		public async Task<IActionResult> GetTransferType(int id)
		{
			TransferType transferType = await context.TransferTypes.FindAsync(id);

			if (transferType == null) { return NotFound(); }

			return Ok(transferType);
		}

		// POST: api/transferType
		[HttpPost]
		public async Task<IActionResult> PostVATState([FromBody] TransferType transferType)
		{
			if (ModelState.IsValid)
			{
				context.TransferTypes.Add(transferType);
				await context.SaveChangesAsync();

				return Ok(transferType);
			}
			else
			{
				return BadRequest(ModelState);
			}
		}

		// PUT: api/transferType/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutVATState([FromRoute] int id, [FromBody] TransferType transferType)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			if (id != transferType.TransferTypeId) return BadRequest();

			context.Entry(transferType).State = EntityState.Modified;

			try
			{
				await context.SaveChangesAsync();
			}

			catch (DbUpdateConcurrencyException)
			{
				transferType = await context.TransferTypes.FindAsync(id);

				if (transferType == null) return NotFound(); else throw;
			}

			return Ok(transferType);
		}

		// DELETE: api/transferType/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteVATState([FromRoute] int id)
		{
			TransferType transferType = await context.TransferTypes.FindAsync(id);

			if (transferType == null) { return NotFound(); }

			context.TransferTypes.Remove(transferType);
			await context.SaveChangesAsync();

			return NoContent();
		}
	}
}
