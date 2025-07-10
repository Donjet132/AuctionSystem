using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AuctionSystem.Domain.Common;

namespace AuctionSystem.Domain.Entities
{
    public class Auction : AuditableEntity
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal StartPrice { get; set; }
        public int SellerId { get; set; }
        public bool IsActive => DateTime.UtcNow < EndDate;
        public int? WinnerId { get; set; }
        public User? Winner { get; set; }

        public User Seller { get; set; } = null!;
        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
    }
}
