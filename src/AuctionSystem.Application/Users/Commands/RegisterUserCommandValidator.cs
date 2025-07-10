using FluentValidation;

namespace AuctionSystem.Application.Users.Commands
{
    public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
    {
        public RegisterUserCommandValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty()
                .Length(4, 20);

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(8);
        }
    }
}
