namespace Lights_Off.Services.SleepCoachService
{
    public interface ISleepCoach
    {
        // short feedback on the most recent night
        Task<string> GetLatestNightFeedbackAsync(int userId);

        // a review of one whole month
        Task<string> GetMonthlyFeedbackAsync(int userId, int year, int month);
    }
}
