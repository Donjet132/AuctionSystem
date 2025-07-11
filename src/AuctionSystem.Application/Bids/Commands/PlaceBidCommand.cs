using MediatR;

namespace AuctionSystem.Application.Bids.Commands
{
    public class PlaceBidCommand : IRequest<int>
    {
        public int AuctionId { get; set; }
        public int BidderId { get; set; }
        public decimal Amount { get; set; }
    }
}
