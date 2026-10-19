using System.ComponentModel.DataAnnotations;

namespace Lights_Off.Models
{
    public class User
    {
        [Required]
        [Key]
        public int UserId { get; set; }
        [Required]
        public string OAuthProviderId { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; } = string.Empty;
        public string? SleepGoal { get; set; }
    }
}
