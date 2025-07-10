using MediatR;

namespace AuctionSystem.Application.Auctions.Commands
{
    public class CreateAuctionCommand : IRequest<int>
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal StartPrice { get; set; }
        public int SellerId { get; set; }
    }
}
