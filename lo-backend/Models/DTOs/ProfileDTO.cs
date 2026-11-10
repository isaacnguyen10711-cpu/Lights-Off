using Lights_Off.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Lights_Off.Models.DTOs
{
    // what the user is allowed to change on their profile page
    public class ProfileUpdateRequest
    {
        // same limit as the DisplayName column on User
        [StringLength(100)]
        public string? DisplayName { get; set; }

        // empty list means they haven't picked any.
        // [EnumDataType] doesn't work on a list, so the controller checks each one
        public List<SleepGoal> SleepGoals { get; set; } = [];
    }
}
