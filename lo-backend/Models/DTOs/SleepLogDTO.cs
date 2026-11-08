using Lights_Off.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Lights_Off.Models.DTOs
{
    public class SleepLogRequest
    {
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

    // What the API sends back = everything above + the id, date and hours slept
    public class SleepLogResponse : SleepLogRequest
    {
        public int SleepLogId { get; set; }

        // worked out by the API from the wake up time
        public DateOnly Date { get; set; }
        public double HoursSlept => Math.Round((WakeUpTime - Bedtime).TotalHours, 1);

        public string? LastNightFeedback { get; set; }

        // turns a database row into what the API sends back, so the field list only lives here
        public static SleepLogResponse Create(SleepLog s)
        {
            return new SleepLogResponse
            {
                SleepLogId = s.SleepLogId,
                Date = s.Date,
                Bedtime = s.Bedtime,
                WakeUpTime = s.WakeUpTime,
                Quality = s.Quality,
                CaffeineAfter3pm = s.CaffeineAfter3pm,
                Exercised = s.Exercised,
                StressLevel = s.StressLevel,
                ScreenTimeBeforeBed = s.ScreenTimeBeforeBed,
                AfternoonNapDuration = s.AfternoonNapDuration,
                LastNightFeedback = s.LastNightFeedback
            };
        }
    }

    // one month for the dashboard: the month's numbers, plus every log in it
    public class SleepLogMonthlyResponse
    {
        public double QualityAverage { get; set; }
        public double HoursSleptAverage { get; set; }
        public int NumberOfLogs { get; set; }
        public List<SleepLogResponse> Logs { get; set; } = [];
    }
}
