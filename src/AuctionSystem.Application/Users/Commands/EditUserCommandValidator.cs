using FluentValidation;

namespace AuctionSystem.Application.Users.Commands
{

    public class EditUserCommandValidator : AbstractValidator<EditUserCommand>
    {
        public EditUserCommandValidator()
        {
            When(x => !string.IsNullOrWhiteSpace(x.Username), () =>
            {
                RuleFor(x => x.Username)
                    .NotEmpty()
                    .Length(4, 20);
            });

            When(x => !string.IsNullOrWhiteSpace(x.NewPassword), () =>
            {
                RuleFor(x => x.NewPassword)
                    .MinimumLength(8).WithMessage("New password must be at least 8 characters");

                RuleFor(x => x.CurrentPassword)
                    .NotEmpty().WithMessage("Current password is required when changing password")
                    .MinimumLength(8);
            });
        }
    }
}
