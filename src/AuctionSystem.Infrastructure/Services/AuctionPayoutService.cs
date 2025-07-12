using AuctionSystem.Application.Interfaces.Repositories;
using AuctionSystem.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

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
                bool payoutSuccessful = await TryPayoutAuctionAsync(auction, auctionRepo, bidRepo, userRepo, stoppingToken);
                if (!payoutSuccessful)
                {
                    auction.IsPaidOut = true;
                    await auctionRepo.UpdateAuctionAsync(auction, stoppingToken);
                }
            }

            var nextAuctionEnd = await auctionRepo.GetNextUnpaidAuctionEndDateAsync(stoppingToken);
            var delay = nextAuctionEnd.HasValue
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

    private async Task<bool> TryPayoutAuctionAsync(
        Auction auction,
        IAuctionRepository auctionRepo,
        IBidRepository bidRepo,
        IUserRepository userRepo,
        CancellationToken cancellationToken)
    {
        var bids = await bidRepo.GetBidsByAuctionIdAsync(auction.Id, cancellationToken);
        var orderedBids = bids.OrderByDescending(b => b.Amount).ToList();

        if (!orderedBids.Any())
        {
            auction.IsPaidOut = true;
            await auctionRepo.UpdateAuctionAsync(auction, cancellationToken);
            return true;
        }

        var seller = await userRepo.GetUserByIdAsync(auction.SellerId, cancellationToken);
        if (seller == null)
            return false;

        foreach (var bid in orderedBids)
        {
            var buyer = await userRepo.GetUserByIdAsync(bid.BidderId, cancellationToken);
            if (buyer == null)
                continue;

            if (buyer.WalletAmount >= bid.Amount)
            {
                buyer.WalletAmount -= bid.Amount;
                seller.WalletAmount += bid.Amount;

                auction.IsPaidOut = true;

                await userRepo.UpdateUserAsync(buyer, cancellationToken);
                await userRepo.UpdateUserAsync(seller, cancellationToken);
                await auctionRepo.UpdateAuctionAsync(auction, cancellationToken);

                return true;
            }
        }

        return false;
    }
}
