using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionSystem.Persistence.Repositories
{
    public class BidRepository : IBidRepository
    {
        private readonly ApplicationDbContext _context;

        public BidRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Bid?> GetBidByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Bids.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task<List<Bid>> GetBidsByAuctionIdAsync(int auctionId, CancellationToken cancellationToken)
        {
            return await _context.Bids
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.Amount)
                .ToListAsync(cancellationToken);
        }

        public async Task<int> PlaceBidAsync(Bid bid, CancellationToken cancellationToken)
        {
            _context.Bids.Add(bid);
            await _context.SaveChangesAsync(cancellationToken);
            return bid.Id;
        }
    }
}
