using AuctionSystem.Application.Auctions.Dtos;
using MediatR;

namespace AuctionSystem.Application.Auctions.Queries
{
    public class GetAuctionByIdQuery : IRequest<AuctionDetailsDto?>
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public GetAuctionByIdQuery(int id, int userId)
        {
            Id = id;
            UserId = userId;
        }
    }
}
