using AuctionSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AuctionSystem.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasMany(u => u.Auctions)
                   .WithOne(a => a.Seller)
                   .HasForeignKey(a => a.SellerId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.Bids)
                   .WithOne(b => b.Bidder)
                   .HasForeignKey(b => b.BidderId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
