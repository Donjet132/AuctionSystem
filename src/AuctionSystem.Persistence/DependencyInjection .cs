using Microsoft.Extensions.DependencyInjection;
using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Persistence.Repositories;

namespace AuctionSystem.Persistence
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();

            return services;
        }
    }
}
