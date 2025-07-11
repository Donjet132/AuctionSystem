using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Auctions.Queries
{
    public class GetAuctionByIdQueryHandler : IRequestHandler<GetAuctionByIdQuery, Auction?>
    {
        private readonly IAuctionRepository _auctionRepository;

        public GetAuctionByIdQueryHandler(IAuctionRepository auctionRepository)
        {
            _auctionRepository = auctionRepository;
        }

        public async Task<Auction?> Handle(GetAuctionByIdQuery request, CancellationToken cancellationToken)
        {
            return await _auctionRepository.GetAuctionByIdAsync(request.Id, cancellationToken);
        }
    }
}
