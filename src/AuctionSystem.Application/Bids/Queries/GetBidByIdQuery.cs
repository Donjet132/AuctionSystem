using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Bids.Queries
{
    public class GetBidByIdQuery : IRequest<Bid?>
    {
        public int BidId { get; set; }

        public GetBidByIdQuery(int bidId)
        {
            BidId = bidId;
        }
    }
}
