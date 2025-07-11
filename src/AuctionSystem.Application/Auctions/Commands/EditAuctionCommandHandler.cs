using AuctionSystem.Application.Interfaces.Repositories;
using MediatR;

namespace AuctionSystem.Application.Auctions.Commands
{
    public class EditAuctionCommandHandler : IRequestHandler<EditAuctionCommand, bool>
    {
        private readonly IAuctionRepository _auctionRepository;

        public EditAuctionCommandHandler(IAuctionRepository auctionRepository)
        {
            _auctionRepository = auctionRepository;
        }

        public async Task<bool> Handle(EditAuctionCommand request, CancellationToken cancellationToken)
        {
            var auction = await _auctionRepository.GetAuctionByIdAsync(request.Id, cancellationToken);

            if (auction == null || auction.SellerId != request.SellerId)
            {
                return false;
            }

            auction.Title = request.Title;
            auction.Description = request.Description;
            auction.StartDate = request.StartDate;
            auction.EndDate = request.EndDate;
            auction.StartPrice = request.StartPrice;

            return await _auctionRepository.UpdateAuctionAsync(auction, cancellationToken);
        }
    }
}
