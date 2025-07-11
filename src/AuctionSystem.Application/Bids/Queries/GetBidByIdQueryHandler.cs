using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Bids.Queries
{
    public class GetBidByIdQueryHandler : IRequestHandler<GetBidByIdQuery, Bid?>
    {
        private readonly IBidRepository _bidRepository;

        public GetBidByIdQueryHandler(IBidRepository bidRepository)
        {
            _bidRepository = bidRepository;
        }

        public async Task<Bid?> Handle(GetBidByIdQuery request, CancellationToken cancellationToken)
        {
            return await _bidRepository.GetBidByIdAsync(request.BidId, cancellationToken);
        }
    }
}
