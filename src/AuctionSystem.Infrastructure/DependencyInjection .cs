using Microsoft.Extensions.DependencyInjection;
using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Persistence.Repositories;
using AuctionSystem.Application.Interfaces.Services;
using AuctionSystem.Infrastructure.Authentication;

namespace AuctionSystem.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();

            return services;
        }
    }
}
