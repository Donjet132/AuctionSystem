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
        private readonly ILogger<AuctionsController> _logger;

        public AuctionsController(IMediator mediator, ILogger<AuctionsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _mediator.Send(new GetAllAuctionsQuery());
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving all auctions.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var result = await _mediator.Send(new GetAuctionByIdQuery(id, userId));
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving auction with ID {AuctionId} for user {UserId}.", id, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
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
                _logger.LogError(ex, "Error occurred while creating auction for seller ID {SellerId}", command.SellerId);
                return BadRequest(new { message = "Failed to create auction." });
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
                _logger.LogError(ex, "Error occurred while editing auction with ID {AuctionId} by seller ID {SellerId}", id, command.SellerId);
                return BadRequest(new { message = "Failed to edit auction." });
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
                _logger.LogError(ex, "Error occurred while deleting auction with ID {AuctionId} by seller ID {SellerId}", id,
                    User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                return BadRequest(new { message = "Failed to delete auction." });
            }
        }
    }
}
