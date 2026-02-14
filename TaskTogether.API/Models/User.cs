namespace TaskTogether.API.Models
{
    public class User
    {
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? Role { get; set; } // Parent | Child
        public string? FamilyId { get; set; }
    }
}
