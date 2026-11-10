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

        // null means they haven't picked a goal, anything not in the enum gets a 400
        [EnumDataType(typeof(SleepGoal))]
        public SleepGoal? SleepGoal { get; set; }
    }
}
