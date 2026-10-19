using Lights_Off.Models.Enums;
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
        [StringLength(256)]
        public string Email { get; set; } = string.Empty;
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string UserName { get; set; } = string.Empty;
        public SleepGoal? SleepGoal { get; set; }
    }
}
