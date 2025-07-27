using System.Security.Authentication;
using System.Security.Claims;
using AuctionSystem.API.Controllers;
using AuctionSystem.Application.Users.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static AuctionSystem.Application.Users.Commands.EditUserCommandHandler;
using static AuctionSystem.Application.Users.Commands.RegisterUserCommandHandler;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IMediator mediator, ILogger<AuthController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginUserCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (AuthenticationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during login for user: {Username}", command.Username);
            return Unauthorized(new { message = "Authentication failed. Please try again." });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserCommand command)
    {
        try
        {
            await _mediator.Send(command);
            return Ok(new { message = "User registered successfully" });
        }
        catch (RegistrationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during registration for username: {Username}", command.Username);
            return BadRequest(new { message = "Registration failed. Please try again." });
        }
    }

    [Authorize]
    [HttpPut("edit")]
    public async Task<IActionResult> EditUser(EditUserCommand command)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            command.Id = userId;

            var result = await _mediator.Send(command);
            if (!result)
                return BadRequest(new { message = "Failed to update user" });

            return Ok(new { message = "User updated successfully" });
        }
        catch (EditUserException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during update for username: {Username}", command.Username);
            return BadRequest(new { message = "User update failed. Please try again." });
        }
    }

}
