using Lights_Off.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Lights_Off.Models.DTOs
{
    public class SleepLogRequest
    {
        [Required] 
        public DateOnly Date { get; set; }
        [Required] 
        public DateTime Bedtime { get; set; }
        [Required] 
        public DateTime WakeUpTime { get; set; }
        [Required, Range(1, 10)] 
        public int Quality { get; set; }
        public bool? CaffeineAfter3pm { get; set; }
        public bool? Exercised { get; set; }
        [Range(1, 10)] public int? StressLevel { get; set; }
        public ScreenTimeBeforeBed? ScreenTimeBeforeBed { get; set; }
        public AfternoonNapDuration? AfternoonNapDuration { get; set; }
    }

    // What the API sends back = everything above + 2 extras
    public class SleepLogResponse : SleepLogRequest
    {
        public int SleepLogId { get; set; }
        public double HoursSlept => Math.Round((WakeUpTime - Bedtime).TotalHours, 1);
    }
}
