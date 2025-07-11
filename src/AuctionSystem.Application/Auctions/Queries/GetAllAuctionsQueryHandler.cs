using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Auctions.Queries
{
    public class GetAllAuctionsQueryHandler : IRequestHandler<GetAllAuctionsQuery, List<Auction>>
    {
        private readonly IAuctionRepository _auctionRepository;

        public GetAllAuctionsQueryHandler(IAuctionRepository auctionRepository)
        {
            _auctionRepository = auctionRepository;
        }

        public async Task<List<Auction>> Handle(GetAllAuctionsQuery request, CancellationToken cancellationToken)
        {
            return await _auctionRepository.GetAllAuctionsAsync(cancellationToken);
        }
    }
}
