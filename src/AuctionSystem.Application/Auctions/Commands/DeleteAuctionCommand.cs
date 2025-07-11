using MediatR;

namespace AuctionSystem.Application.Auctions.Commands
{
    public class DeleteAuctionCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public int SellerId { get; set; }
    }
}
