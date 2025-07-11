using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Bids.Queries
{
    public class GetBidsByAuctionIdQueryHandler : IRequestHandler<GetBidsByAuctionIdQuery, List<Bid>>
    {
        private readonly IBidRepository _bidRepository;
        private readonly IAuctionRepository _auctionRepository;

        public GetBidsByAuctionIdQueryHandler(IBidRepository bidRepository, IAuctionRepository auctionRepository)
        {
            _bidRepository = bidRepository;
            _auctionRepository = auctionRepository;
        }

        public async Task<List<Bid>> Handle(GetBidsByAuctionIdQuery request, CancellationToken cancellationToken)
        {
            var auction = await _auctionRepository.GetAuctionByIdAsync(request.AuctionId, cancellationToken);
            if (auction == null)
                throw new Exception("Auction not found.");

            if (auction.SellerId != request.RequestingUserId)
                throw new UnauthorizedAccessException("You are not authorized to view all bids for this auction.");

            return await _bidRepository.GetBidsByAuctionIdAsync(request.AuctionId, cancellationToken);
        }
    }
}
