using Lights_Off.Services;

namespace lo_backend.Tests
{
    // a pretend coach so tests never call the real Claude API
    public class FakeSleepCoach : ISleepCoach
    {
        public Task<string> GetLastNightFeedbackAsync(int userId)
        {
            return Task.FromResult("Great job!");
        }

        public Task<string> GetMonthlyFeedbackAsync(int userId, int year, int month)
        {
            return Task.FromResult("Nice month!");
        }
    }
}