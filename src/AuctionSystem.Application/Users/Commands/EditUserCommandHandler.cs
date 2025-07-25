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

        public class EditUserException : Exception
        {
            public EditUserException(string message) : base(message) { }
        }

        public async Task<bool> Handle(EditUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByIdAsync(request.Id, cancellationToken);
            if (user == null)
                throw new EditUserException("User not found.");

            // Check if username is being changed and if the new username already exists
            if (!string.IsNullOrEmpty(request.Username) && !string.Equals(request.Username, user.Username, StringComparison.OrdinalIgnoreCase))
            {
                var existingUser = await _userRepository.GetByUsernameAsync(request.Username, cancellationToken);
                if (existingUser != null)
                    throw new EditUserException("Username already exists. Please choose a different username.");

                user.Username = request.Username;
            }

            if (!string.IsNullOrEmpty(request.NewPassword))
            {
                if (string.IsNullOrEmpty(request.CurrentPassword))
                    throw new EditUserException("Current password is required to change password.");
                bool isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash);
                if (!isCurrentPasswordValid)
                    throw new EditUserException("Current password is incorrect.");
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            }

            return await _userRepository.UpdateUserAsync(user, cancellationToken);
        }
    }
}
