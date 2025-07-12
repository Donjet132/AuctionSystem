using AuctionSystem.Application.Interfaces.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Threading;

public class AuctionPayoutService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private static readonly ManualResetEventSlim _rescheduleSignal = new(false);
    public static ManualResetEventSlim RescheduleSignal => _rescheduleSignal;

    public AuctionPayoutService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _serviceProvider.CreateScope();
            var auctionRepo = scope.ServiceProvider.GetRequiredService<IAuctionRepository>();
            var bidRepo = scope.ServiceProvider.GetRequiredService<IBidRepository>();
            var userRepo = scope.ServiceProvider.GetRequiredService<IUserRepository>();

            var endedAuctions = await auctionRepo.GetUnpaidEndedAuctionsAsync(stoppingToken);

            foreach (var auction in endedAuctions)
            {
                var bids = await bidRepo.GetBidsByAuctionIdAsync(auction.Id, stoppingToken);
                var winningBid = bids.OrderByDescending(b => b.Amount).FirstOrDefault();

                if (winningBid == null)
                    continue;

                var buyer = await userRepo.GetUserByIdAsync(winningBid.BidderId, stoppingToken);
                var seller = await userRepo.GetUserByIdAsync(auction.SellerId, stoppingToken);

                if (buyer == null || seller == null || buyer.WalletAmount < winningBid.Amount)
                    continue;

                buyer.WalletAmount -= winningBid.Amount;
                seller.WalletAmount += winningBid.Amount;

                auction.IsPaidOut = true;

                await userRepo.UpdateUserAsync(buyer, stoppingToken);
                await userRepo.UpdateUserAsync(seller, stoppingToken);
                await auctionRepo.UpdateAuctionAsync(auction, stoppingToken);
            }

            var nextAuctionEnd = await auctionRepo.GetNextUnpaidAuctionEndDateAsync(stoppingToken);
            TimeSpan delay = nextAuctionEnd.HasValue
                ? nextAuctionEnd.Value - DateTime.UtcNow
                : TimeSpan.FromMinutes(5);

            if (delay < TimeSpan.Zero)
                delay = TimeSpan.Zero;

            _rescheduleSignal.Reset();

            var delayTask = Task.Delay(delay, stoppingToken);
            var signalTask = Task.Run(() => _rescheduleSignal.Wait(stoppingToken));

            await Task.WhenAny(delayTask, signalTask);
        }
    }
}
