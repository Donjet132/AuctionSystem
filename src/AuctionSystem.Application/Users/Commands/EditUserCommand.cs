using MediatR;

namespace AuctionSystem.Application.Users.Commands
{
    public class EditUserCommand : IRequest<bool>
    {
        public int Id { get; set; } 
        public string? Username { get; set; } = null!;
        public string? NewPassword { get; set; }
        public string? CurrentPassword { get; set; }
    }
}
