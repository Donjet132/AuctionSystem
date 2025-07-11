using AuctionSystem.Domain.Entities;

namespace AuctionSystem.Application.Interfaces.Repositories
{
    public interface IBidRepository
    {
        Task<Bid?> GetBidByIdAsync(int id, CancellationToken cancellationToken);
        Task<List<Bid>> GetBidsByAuctionIdAsync(int auctionId, CancellationToken cancellationToken);
        Task<int> PlaceBidAsync(Bid bid, CancellationToken cancellationToken);
    }
}
