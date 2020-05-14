using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Transfers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]
    public class TransfersController : ControllerBase {

        private readonly ITransferRepository repo;

        public TransfersController(ITransferRepository repo) => (this.repo) = (repo);

        [HttpGet("date/{dateIn}")]
        public TransferGroupResultResource<TransferResource> Get(DateTime dateIn) {
            var transfers = this.repo.Get(dateIn);
            return transfers;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransfer(int id) {
            Transfer transfer = await repo.GetById(id);
            if (transfer == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(transfer);
        }

        [HttpPost]
        public IActionResult PostTransfer([FromBody] Transfer transfer) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            repo.Create(transfer);
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public IActionResult PutTransfer([FromRoute] int id, [FromBody] SaveTransferResource saveTransferResource) {
            if (id != saveTransferResource.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            try {
                repo.Update(saveTransferResource);
            } catch (System.Exception) {
                return NotFound(new { response = ApiMessages.RecordNotFound() });
            }
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransfer([FromRoute] int id) {
            Transfer transfer = await repo.GetById(id);
            if (transfer == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            repo.Delete(transfer);
            return Ok(new { response = ApiMessages.RecordDeleted() });
        }

        [HttpPatch("assignDriver")]
        public IActionResult AssignDriver(int driverId, [FromQuery(Name = "id")] int[] ids) {
            repo.AssignDriver(driverId, ids);
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

    }

}