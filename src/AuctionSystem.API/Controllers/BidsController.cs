using AuctionSystem.Application.Bids.Commands;
using AuctionSystem.Application.Bids.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuctionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BidsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BidsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("place")]
        public async Task<IActionResult> PlaceBid([FromBody] PlaceBidCommand command)
        {
            try
            {
                command.BidderId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var bidId = await _mediator.Send(command);
                return Ok(new { message = "Bid placed successfully", bidId });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("auction/{auctionId}")]
        public async Task<IActionResult> GetBidsByAuction(int auctionId)
        {
            try
            {
                int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var query = new GetBidsByAuctionIdQuery(auctionId, userId);

                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBidById(int id)
        {
            try
            {
                var result = await _mediator.Send(new GetBidByIdQuery(id));

                if (result == null)
                    return NotFound();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
