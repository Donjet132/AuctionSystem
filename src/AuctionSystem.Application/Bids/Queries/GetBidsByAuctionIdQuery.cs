using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Bids.Queries
{
    public class GetBidsByAuctionIdQuery : IRequest<List<Bid>>
    {
        public int AuctionId { get; set; }
        public int RequestingUserId { get; set; }

        public GetBidsByAuctionIdQuery(int auctionId, int requestingUserId)
        {
            AuctionId = auctionId;
            RequestingUserId = requestingUserId;
        }
    }
}
