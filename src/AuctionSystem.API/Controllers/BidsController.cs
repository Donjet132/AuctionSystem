using AuctionSystem.Application.Bids.Commands;
using AuctionSystem.Application.Bids.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static AuctionSystem.Application.Bids.Commands.PlaceBidCommandHandler;

namespace AuctionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BidsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<BidsController> _logger;

        public BidsController(IMediator mediator, ILogger<BidsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpPost("place")]
        [Authorize]
        public async Task<IActionResult> PlaceBid([FromBody] PlaceBidCommand command)
        {
            try
            {
                command.BidderId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var bidId = await _mediator.Send(command);
                return Ok(new { message = "Bid placed successfully", bidId });
            }
            catch (UnauthorizedBidException ex)
            {
                _logger.LogWarning(ex, "Unauthorized bid attempt by user ID {BidderId}", command.BidderId);
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Not found error while placing bid by user ID {BidderId}", command.BidderId);
                return NotFound(new { message = ex.Message });
            }
            catch (BadRequestException ex)
            {
                _logger.LogWarning(ex, "Bad request while placing bid by user ID {BidderId}", command.BidderId);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while placing bid by user ID {BidderId}", command.BidderId);
                return BadRequest(new { message = "Failed to place bid due to unexpected error." });
            }
        }

        [HttpGet("auction/{auctionId}")]
        [Authorize]
        public async Task<IActionResult> GetBidsByAuction(int auctionId)
        {
            try
            {
                int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var query = new GetBidsByAuctionIdQuery(auctionId, userId);

                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access attempt by user ID {UserId} for auction ID {AuctionId}",
                    User.FindFirstValue(ClaimTypes.NameIdentifier), auctionId);
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving bids for auction ID {AuctionId} by user ID {UserId}",
                    auctionId, User.FindFirstValue(ClaimTypes.NameIdentifier));
                return BadRequest(new { message = "Failed to retrieve bids." });
            }
        }


        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetBidById(int id)
        {
            try
            {
                var result = await _mediator.Send(new GetBidByIdQuery(id));

                if (result == null)
                {
                    _logger.LogWarning("Bid with ID {BidId} not found.", id);
                    return NotFound(new { message = $"Bid with ID {id} not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving bid with ID {BidId}", id);
                return BadRequest(new { message = "Failed to retrieve bid." });
            }
        }

    }
}
