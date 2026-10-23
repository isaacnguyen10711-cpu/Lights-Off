namespace Lights_Off.Services
{
    public interface ISleepCoach
    {
        // short feedback on the most recent night
        Task<string> GetLastNightFeedbackAsync(int userId);

        // a bigger review of the last 7 days
        Task<string> GetWeeklyReviewAsync(int userId);
    }
}
