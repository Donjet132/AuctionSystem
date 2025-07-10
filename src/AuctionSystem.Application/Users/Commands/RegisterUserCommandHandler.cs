using AuctionSystem.Application.Interfaces.Repositories;
using MediatR;

namespace AuctionSystem.Application.Users.Commands
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, int>
    {
        private readonly IUserRepository _userRepository;

        public RegisterUserCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<int> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            if (await _userRepository.UsernameExistsAsync(request.Username, cancellationToken))
                throw new Exception("Username already taken.");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var userId = await _userRepository.AddUserAsync(request.Username, passwordHash, cancellationToken);

            return userId;
        }
    }
}
