using AuctionSystem.Application.Auctions.Dtos;
using System.Security.Claims;
using AuctionSystem.Application.Interfaces.Repositories;
using MediatR;
using AuctionSystem.Application.Bids.Bids;

namespace AuctionSystem.Application.Auctions.Queries
{
    public class GetAuctionByIdQueryHandler : IRequestHandler<GetAuctionByIdQuery, AuctionDetailsDto?>
    {
        private readonly IAuctionRepository _auctionRepository;

        public GetAuctionByIdQueryHandler(IAuctionRepository auctionRepository)
        {
            _auctionRepository = auctionRepository;
        }

        public async Task<AuctionDetailsDto?> Handle(GetAuctionByIdQuery request, CancellationToken cancellationToken)
        {
            var auction = await _auctionRepository.GetAuctionByIdAsync(request.Id, cancellationToken);

            if (auction == null)
                return null;

            bool isSeller = auction.SellerId == request.UserId;

            var bids = isSeller
                ? auction.Bids
                    .OrderByDescending(b => b.Created)
                    .Select(b => new BidDto
                    {
                        Id = b.Id,
                        Amount = b.Amount,
                        TimePlaced = b.Created,
                        BidderName = b.Bidder.Username
                    })
                    .ToList()
                : new List<BidDto>();

            var highestBidAmount = auction.Bids.Any()
                ? auction.Bids.Max(b => b.Amount)
                : (decimal?)null;

            return new AuctionDetailsDto
            {
                Id = auction.Id,
                Title = auction.Title,
                Description = auction.Description,
                StartDate = auction.StartDate.Date,
                EndDate = auction.EndDate.Date,
                StartPrice = auction.StartPrice,
                WinnerName = auction.WinnerId != null ? auction.Winner?.Username : null,
                IsSeller = isSeller,
                HighestBid = highestBidAmount,
                Bids = bids
            };
        }

    }
}
