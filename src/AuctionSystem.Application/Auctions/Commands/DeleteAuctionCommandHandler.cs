using AuctionSystem.Application.Interfaces.Repositories;
using MediatR;

namespace AuctionSystem.Application.Auctions.Commands
{
    public class DeleteAuctionCommandHandler : IRequestHandler<DeleteAuctionCommand, bool>
    {
        private readonly IAuctionRepository _auctionRepository;

        public DeleteAuctionCommandHandler(IAuctionRepository auctionRepository)
        {
            _auctionRepository = auctionRepository;
        }

        public async Task<bool> Handle(DeleteAuctionCommand request, CancellationToken cancellationToken)
        {
            var auction = await _auctionRepository.GetAuctionByIdAsync(request.Id, cancellationToken);

            if (auction == null || auction.SellerId != request.SellerId)
            {
                return false;
            }

            return await _auctionRepository.DeleteAuctionAsync(request.Id, cancellationToken);
        }
    }
}
