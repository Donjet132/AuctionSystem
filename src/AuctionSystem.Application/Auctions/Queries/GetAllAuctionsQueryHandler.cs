using AuctionSystem.Application.Auctions.Dtos;
using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Auctions.Queries
{
    public class GetAllAuctionsQueryHandler : IRequestHandler<GetAllAuctionsQuery, List<AuctionDetailsDto>>
    {
        private readonly IAuctionRepository _auctionRepository;

        public GetAllAuctionsQueryHandler(IAuctionRepository auctionRepository)
        {
            _auctionRepository = auctionRepository;
        }

        public async Task<List<AuctionDetailsDto>> Handle(GetAllAuctionsQuery request, CancellationToken cancellationToken)
        {
            var auctions = await _auctionRepository.GetAllAuctionsAsync(cancellationToken);

            return auctions.Select(a => new AuctionDetailsDto
            {
                Id = a.Id,
                Title = a.Title,
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                StartPrice = a.StartPrice
            }).ToList();
        }
    }
}
