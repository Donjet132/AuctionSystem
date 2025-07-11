using Microsoft.Extensions.DependencyInjection;
using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Application.Interfaces.Services;
using AuctionSystem.Infrastructure.Authentication;
using AuctionSystem.Persistence.Repositories;

namespace AuctionSystem.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IAuctionRepository, AuctionRepository>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();

            return services;
        }
    }
}
