using FluentValidation;

namespace AuctionSystem.Application.Bids.Commands
{
    public class PlaceBidCommandValidator : AbstractValidator<PlaceBidCommand>
    {
        public PlaceBidCommandValidator()
        {
            RuleFor(x => x.Amount)
               .GreaterThan(0)
               .WithMessage("Bid amount must be greater than 0.");

            RuleFor(x => x.AuctionId)
                .GreaterThan(0);

            RuleFor(x => x.BidderId)
                .GreaterThan(0);
        }
    }
}
