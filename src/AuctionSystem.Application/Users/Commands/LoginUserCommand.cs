using MediatR;

namespace AuctionSystem.Application.Users.Commands
{
    public record LoginUserCommand(string Username, string Password) : IRequest<string>;
}
