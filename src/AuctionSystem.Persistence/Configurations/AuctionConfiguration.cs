using AuctionSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AuctionSystem.Persistence.Configurations
{
    public class AuctionConfiguration : IEntityTypeConfiguration<Auction>
    {
        public void Configure(EntityTypeBuilder<Auction> builder)
        {
            builder.HasMany(a => a.Bids)
                   .WithOne(b => b.Auction)
                   .HasForeignKey(b => b.AuctionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
