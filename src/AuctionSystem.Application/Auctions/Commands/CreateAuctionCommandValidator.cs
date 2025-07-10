using FluentValidation;

namespace AuctionSystem.Application.Auctions.Commands
{
    public class CreateAuctionCommandValidator : AbstractValidator<CreateAuctionCommand>
    {
        public CreateAuctionCommandValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Description)
                .NotEmpty();

            RuleFor(x => x.StartDate)
                .LessThan(x => x.EndDate)
                .WithMessage("Start date must be before end date.");

            RuleFor(x => x.EndDate)
                .GreaterThan(DateTime.UtcNow)
                .WithMessage("End date must be in the future.");

            RuleFor(x => x.StartPrice)
                .GreaterThan(0);
        }
    }
}
