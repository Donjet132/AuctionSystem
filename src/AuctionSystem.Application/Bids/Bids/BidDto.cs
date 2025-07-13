namespace AuctionSystem.Application.Bids.Bids
{
    public class BidDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime TimePlaced { get; set; }
        public string BidderName { get; set; } = default!;
    }

}
