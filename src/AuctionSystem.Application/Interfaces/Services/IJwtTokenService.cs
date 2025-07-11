using AuctionSystem.Domain.Entities;

namespace AuctionSystem.Application.Interfaces.Services
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}