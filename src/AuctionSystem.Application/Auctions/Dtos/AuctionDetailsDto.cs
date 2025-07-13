using AuctionSystem.Application.Bids.Bids;

namespace AuctionSystem.Application.Auctions.Dtos
{
    public class AuctionDetailsDto
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal StartPrice { get; set; }
        public string? WinnerName { get; set; }
        public bool IsSeller { get; set; } = false!;
        public List<BidDto> Bids { get; set; } = new();
    }

}
