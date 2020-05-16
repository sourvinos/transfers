using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Transfers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]
    public class TransfersController : ControllerBase {

        private readonly IMapper mapper;
        private readonly ITransferRepository repo;

        public TransfersController(ITransferRepository repo, IMapper mapper) =>
            (this.repo, this.mapper) = (repo, mapper);

        [HttpGet("date/{dateIn}")]
        public TransferGroupResultResource<TransferResource> Get(DateTime dateIn) {
            return this.repo.Get(dateIn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransfer(int id) {
            var transfer = await repo.GetById(id);
            if (transfer == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(transfer);
        }

        [HttpPost]
        public IActionResult PostTransfer([FromBody] SaveTransferResource saveTransferResource) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            var transfer = mapper.Map<SaveTransferResource, Transfer>(saveTransferResource);
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
            var transfer = await repo.GetByIdToDelete(id);
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