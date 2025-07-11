using AuctionSystem.Domain.Entities;

namespace AuctionSystem.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken);
        Task<int> AddUserAsync(string username, string passwordHash, CancellationToken cancellationToken);
        Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken);
        Task<User?> GetUserByIdAsync(int userId, CancellationToken cancellationToken);
        Task<bool> UpdateUserAsync(User user, CancellationToken cancellationToken);
    }
}
