namespace AuctionSystem.Application.Users.Dtos
{
    public class LoginResponseDto
    {
        public int Id { get; set; }
        public string Token { get; set; } = null!;
        public string Username { get; set; } = null!;
        public decimal WalletAmount { get; set; }
    }
}
