namespace Lights_Off.Services
{
    public interface ISleepCoach
    {
        // short feedback on the most recent night
        Task<string> GetLastNightFeedbackAsync(int userId);
    }
}
