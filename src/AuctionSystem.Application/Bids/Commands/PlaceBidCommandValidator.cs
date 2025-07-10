using FluentValidation;

namespace AuctionSystem.Application.Bids.Commands
{
    public class PlaceBidCommandValidator : AbstractValidator<PlaceBidCommand>
    {
        public PlaceBidCommandValidator()
        {
            RuleFor(x => x.AuctionId).GreaterThan(0);
            RuleFor(x => x.Amount).GreaterThan(0);
        }
    }
}
