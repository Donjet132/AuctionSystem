using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Auctions.Queries
{
    public class GetAuctionByIdQuery : IRequest<Auction?>
    {
        public int Id { get; set; }

        public GetAuctionByIdQuery(int id)
        {
            Id = id;
        }
    }
}
