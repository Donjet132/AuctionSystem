using MediatR;

namespace AuctionSystem.Application.Auctions.Commands
{
    public class EditAuctionCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal StartPrice { get; set; }
        public int SellerId { get; set; }
    }
}
