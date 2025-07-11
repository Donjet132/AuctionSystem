using AuctionSystem.Domain.Entities;
using MediatR;

namespace AuctionSystem.Application.Auctions.Queries
{
    public class GetAllAuctionsQuery : IRequest<List<Auction>>
    {
    }
}
