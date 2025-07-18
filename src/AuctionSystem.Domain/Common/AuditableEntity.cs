﻿namespace AuctionSystem.Domain.Common
{
    public abstract class AuditableEntity
    {
        public int Id { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime? Modified { get; set; }
        public int? ModifiedByUserId { get; set; }
    }
}
