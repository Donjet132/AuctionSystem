using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Auctions.Commands
{
    public class CreateAuctionCommandHandler : IRequestHandler<CreateAuctionCommand, int>
    {
        private readonly IAuctionRepository _auctionRepository;

        public CreateAuctionCommandHandler(IAuctionRepository auctionRepository)
        {
            _auctionRepository = auctionRepository;
        }

        public async Task<int> Handle(CreateAuctionCommand request, CancellationToken cancellationToken)
        {
            var auction = new Auction
            {
                Title = request.Title,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                StartPrice = request.StartPrice,
                SellerId = request.SellerId
            };

            return await _auctionRepository.CreateAuctionAsync(auction, cancellationToken);
        }
    }
}
