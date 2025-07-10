using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionSystem.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken)
        {
            return await _context.Users.AnyAsync(u => u.Username == username, cancellationToken);
        }

        public async Task<int> AddUserAsync(string username, string passwordHash, CancellationToken cancellationToken)
        {
            var user = new User
            {
                Username = username,
                PasswordHash = passwordHash,
                WalletAmount = 1000m,
                Created = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);
            return user.Id;
        }

        public async Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username, cancellationToken);
        }
    }
}
