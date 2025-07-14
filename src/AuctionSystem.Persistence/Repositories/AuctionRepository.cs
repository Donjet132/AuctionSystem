using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionSystem.Persistence.Repositories
{
    public class AuctionRepository : IAuctionRepository
    {
        private readonly ApplicationDbContext _context;

        public AuctionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Auction?> GetAuctionByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Auctions
                .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        }

        public async Task<List<Auction>> GetAllAuctionsAsync(CancellationToken cancellationToken)
        {
            return await _context.Auctions.Where(a => !a.IsPaidOut).ToListAsync(cancellationToken);
        }

        public async Task<int> CreateAuctionAsync(Auction auction, CancellationToken cancellationToken)
        {
            _context.Auctions.Add(auction);
            await _context.SaveChangesAsync(cancellationToken);
            return auction.Id;
        }

        public async Task<bool> UpdateAuctionAsync(Auction auction, CancellationToken cancellationToken)
        {
            _context.Auctions.Update(auction);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<bool> DeleteAuctionAsync(int id, CancellationToken cancellationToken)
        {
            var auction = await _context.Auctions.FindAsync(new object[] { id }, cancellationToken);
            if (auction == null)
                return false;

            _context.Auctions.Remove(auction);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<List<Auction>> GetUnpaidEndedAuctionsAsync(CancellationToken cancellationToken)
        {
            return await _context.Auctions
                .Where(a => !a.IsPaidOut && a.EndDate.Date <= DateTime.Now.Date)
                .ToListAsync(cancellationToken);
        }

        public async Task<DateTime?> GetNextUnpaidAuctionEndDateAsync(CancellationToken cancellationToken)
        {
            return await _context.Auctions
                .Where(a => !a.IsPaidOut && a.EndDate.Date > DateTime.Now.Date)
                .OrderBy(a => a.EndDate)
                .Select(a => (DateTime?)a.EndDate)
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
