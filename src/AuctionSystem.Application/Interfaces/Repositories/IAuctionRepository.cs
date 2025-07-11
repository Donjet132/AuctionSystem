using AuctionSystem.Domain.Entities;

namespace AuctionSystem.Application.Interfaces.Repositories
{
    public interface IAuctionRepository
    {
        Task<Auction?> GetAuctionByIdAsync(int id, CancellationToken cancellationToken);
        Task<List<Auction>> GetAllAuctionsAsync(CancellationToken cancellationToken);
        Task<int> CreateAuctionAsync(Auction auction, CancellationToken cancellationToken);
        Task<bool> UpdateAuctionAsync(Auction auction, CancellationToken cancellationToken);
    }
}
