using AuctionSystem.Application.Auctions.Commands;
using AuctionSystem.Application.Auctions.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuctionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuctionsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuctionsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetAllAuctionsQuery());
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetAuctionByIdQuery(id));
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateAuctionCommand command)
        {
            try
            {
                 command.SellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var id = await _mediator.Send(command);
                AuctionPayoutService.RescheduleSignal.Set();
                return CreatedAtAction(nameof(GetById), new { id }, new { id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Edit(int id, EditAuctionCommand command)
        {
            if (id != command.Id)
                return BadRequest("Auction ID mismatch.");

            try
            {
                 command.SellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var result = await _mediator.Send(command);
                if (!result)
                    return NotFound();

                AuctionPayoutService.RescheduleSignal.Set();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                 var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var command = new DeleteAuctionCommand
                {
                    Id = id,
                    SellerId = sellerId
                };

                var result = await _mediator.Send(command);
                if (!result)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
