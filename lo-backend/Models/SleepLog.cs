using Lights_Off.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Lights_Off.Models
{
    public class SleepLog
    {
        [Key]
        public int SleepLogId { get; set; }
        [Required]
        public DateOnly Date { get; set; }
        [Required]
        public DateTime Bedtime { get; set; }
        [Required]
        public DateTime WakeUpTime { get; set; }
        [Required]
        [Range(1, 10)]
        public int Quality { get; set; }

        public bool? CaffeineAfter3pm { get; set; }

        public bool? Exercised { get; set; }
        [Range(1, 10)]
        public int? StressLevel { get; set; }
        public ScreenTimeBeforeBed? ScreenTimeBeforeBed { get; set; }
        public AfternoonNapDuration? AfternoonNapDuration { get; set; }
        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }

}

