using AuctionSystem.Application.Auctions.Dtos;
using MediatR;

namespace AuctionSystem.Application.Auctions.Queries
{
    public class GetAllAuctionsQuery : IRequest<List<AuctionDetailsDto>>
    {
    }
}
