using MediatR;

namespace AuctionSystem.Application.Users.Commands
{
    public class RegisterUserCommand : IRequest<int>
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
