using AuctionSystem.Application.Interfaces.Repositories;
using MediatR;

namespace AuctionSystem.Application.Users.Commands
{
    public class EditUserCommandHandler : IRequestHandler<EditUserCommand, bool>
    {
        private readonly IUserRepository _userRepository;

        public EditUserCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(EditUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByIdAsync(request.Id, cancellationToken);
            if (user == null)
                throw new Exception("User not found.");

            if (!string.IsNullOrEmpty(request.NewPassword))
            {
                if (string.IsNullOrEmpty(request.CurrentPassword))
                    throw new Exception("Current password is required to change password.");

                bool isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash);
                if (!isCurrentPasswordValid)
                    throw new Exception("Current password is incorrect.");

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            }

            user.Username = request.Username;

            return await _userRepository.UpdateUserAsync(user, cancellationToken);
        }
    }
}
