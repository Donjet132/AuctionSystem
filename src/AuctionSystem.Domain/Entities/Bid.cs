using AuctionSystem.Domain.Common;

namespace AuctionSystem.Domain.Entities
{
    public class Bid : AuditableEntity
    {
        public int AuctionId { get; set; }
        public Auction Auction { get; set; } = null!;
        public int BidderId { get; set; }
        public User Bidder { get; set; } = null!;
        public decimal Amount { get; set; }
    }
}
