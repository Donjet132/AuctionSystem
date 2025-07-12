using AuctionSystem.Application.Interfaces.Repositories;
using MediatR;
using AuctionSystem.Application.Interfaces.Services;
using AuctionSystem.Application.Users.Dtos;

namespace AuctionSystem.Application.Users.Commands
{
    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, LoginResponseDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenService _jwtTokenService;

        public LoginUserCommandHandler(IUserRepository userRepository, IJwtTokenService jwtTokenService)
        {
            _userRepository = userRepository;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<LoginResponseDto> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username, cancellationToken);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new Exception("Invalid username or password.");

            var token = _jwtTokenService.GenerateToken(user);

            return new LoginResponseDto
            {
                Id = user.Id,
                Token = token,
                Username = user.Username,
                WalletAmount = user.WalletAmount
            };
        }
    }
}
