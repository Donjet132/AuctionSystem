using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Bids.Commands
{
    public class PlaceBidCommandHandler : IRequestHandler<PlaceBidCommand, int>
    {
        private readonly IBidRepository _bidRepository;
        private readonly IAuctionRepository _auctionRepository;
        private readonly IUserRepository _userRepository;

        public PlaceBidCommandHandler(
            IBidRepository bidRepository,
            IAuctionRepository auctionRepository,
            IUserRepository userRepository)
        {
            _bidRepository = bidRepository;
            _auctionRepository = auctionRepository;
            _userRepository = userRepository;
        }

        public class NotFoundException : Exception
        {
            public NotFoundException(string message) : base(message) { }
        }

        public class UnauthorizedBidException : UnauthorizedAccessException
        {
            public UnauthorizedBidException(string message) : base(message) { }
        }

        public class BadRequestException : Exception
        {
            public BadRequestException(string message) : base(message) { }
        }

        public async Task<int> Handle(PlaceBidCommand request, CancellationToken cancellationToken)
        {
            var auction = await _auctionRepository.GetAuctionByIdAsync(request.AuctionId, cancellationToken);
            if (auction == null)
                throw new NotFoundException("Auction not found.");

            if (auction.SellerId == request.BidderId)
                throw new UnauthorizedBidException("You cannot bid on your own auction.");

            if (auction.EndDate <= DateTime.UtcNow)
                throw new BadRequestException("Auction has already ended.");

            var user = await _userRepository.GetUserByIdAsync(request.BidderId, cancellationToken);
            if (user == null)
                throw new NotFoundException("Bidder not found.");

            if (user.WalletAmount < request.Amount)
                throw new BadRequestException("Insufficient funds.");

            var currentBids = await _bidRepository.GetBidsByAuctionIdAsync(request.AuctionId, cancellationToken);
            var highestBid = currentBids.OrderByDescending(b => b.Amount).FirstOrDefault()?.Amount ?? auction.StartPrice;

            if (request.Amount <= highestBid)
                throw new BadRequestException($"Bid must be greater than current highest bid: {highestBid}");

            var bid = new Bid
            {
                AuctionId = request.AuctionId,
                BidderId = request.BidderId,
                Amount = request.Amount,
                Created = DateTime.UtcNow
            };

            return await _bidRepository.PlaceBidAsync(bid, cancellationToken);
        }
    }
}
