using AuctionSystem.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionSystem.Domain.Entities
{
    public class User : AuditableEntity
    {
        [Required]
        [MaxLength(20)]
        public string Username { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal WalletAmount { get; set; } = 1000m;

        public ICollection<Auction> Auctions { get; set; } = new List<Auction>();
        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
    }
}
