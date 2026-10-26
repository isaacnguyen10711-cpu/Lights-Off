using Lights_Off.Models.Enums;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Lights_Off.Models
{
    // IdentityUser<int> already has Id, UserName, Email, PasswordHash and more.
    // Google/Facebook logins are stored separately in the AspNetUserLogins table.
    public class User : IdentityUser<int>
    {
        // Full name shown in the app, e.g. "Isaac Nguyen" from Google.
        // UserName is the login name, so it can't hold spaces.
        [StringLength(100)]
        public string? DisplayName { get; set; }

        public SleepGoal? SleepGoal { get; set; }
    }
}
