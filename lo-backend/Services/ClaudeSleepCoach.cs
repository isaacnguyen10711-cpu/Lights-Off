using Anthropic;
using Anthropic.Models.Messages;
using Lights_Off.Data;
using Lights_Off.Models;
using Microsoft.EntityFrameworkCore;

namespace Lights_Off.Services
{
    public class ClaudeSleepCoach : ISleepCoach
    {
        private readonly AnthropicClient _anthropicClient;
        private readonly LightsOffDbContext _context;

        public ClaudeSleepCoach(AnthropicClient anthropicClient, LightsOffDbContext context)
        {
            _anthropicClient = anthropicClient;
            _context = context;
        }

        // instructions for the quick "how was last night" feedback
        private const string LastNightPrompt = """
            You are the sleep coach inside Lights Off, a sleep tracking app.
            You'll get the user's most recent night of sleep and their average from the week before.

            Reply with a tiny, cute reaction to that night, like a cheerful friend. It shows up as a
            small card in the app, so keep it to one or two short sentences (under 30 words).

            - Open with a quick reaction that matches the night, like "Great job!", "Nice one!"
              or "Need more sleep!".
            - Then say how many hours they slept and how that compares to their usual.
            - If something clearly stood out (like caffeine or stress), you can add a few words on it.
            - If they have sleep goals, you can link your comment to one of them,
              like "nice, that helps your goal of sleeping longer".
            - One emoji is fine, no lists or headings.
            - Only use the data you were given, don't make anything up.

            Examples of the style (use their real numbers, not these):
            - "Great job! 🌙 You slept 8.1 hours, almost an hour more than usual."
            - "Need more sleep! 😴 Only 5.2 hours, about 2 less than your usual. Maybe skip the late coffee?"

            You give general sleep tips, not medical advice. Don't diagnose anything.
            """;

        // instructions for the end of month review
        private const string MonthlyPrompt = """
            You are the sleep coach inside Lights Off, a sleep tracking app.
            You'll get one month of the user's sleep: their averages and the details of each night they logged.

            Write a short review of their month, like a supportive friend looking back with them:
            - Start with one or two sentences on how the month went overall (hours, quality, consistency).
            - Point out up to three patterns that seem linked to better or worse sleep, like certain days
              of the week, caffeine, exercise, stress, screen time or naps.
            - Mention their best stretch of sleep, so there's something to feel good about.
            - If they have sleep goals, say how the month went for each goal and aim your tips at them.
            - Finish with two or three realistic tips for next month.
            - Keep it friendly, under 200 words and in plain English. Short paragraphs are fine, no headings.
            - If a pattern only shows up on a couple of nights, say it's early days rather than overclaiming.
            - Only use the data you were given, don't make anything up.

            You give general sleep tips, not medical advice. Don't diagnose anything.
            If they're regularly sleeping under 5 hours or sleeping badly most nights, suggest they talk to a doctor.
            """;

        public async Task<string> GetLatestNightFeedbackAsync(int userId)
        {
            var lastNight = await GetLatestLogAsync(userId); 

            if (lastNight == null)
            {
                return "Log your first night of sleep to get feedback.";
            }

            if (lastNight.LastNightFeedback != null)
            {
                return lastNight.LastNightFeedback;
            }

            // the week before it, so Claude has something to compare with
            var logsInWeekBefore = await GetLogsInWeekBeforeAsync(userId, lastNight.Date);

            // if there are no earlier nights, we can't give an average
            var average = "No earlier nights logged yet.";
            if (logsInWeekBefore.Count > 0)
            {
                var averageHours = logsInWeekBefore.Average(s => (s.WakeUpTime - s.Bedtime).TotalHours);
                var averageQuality = logsInWeekBefore.Average(s => s.Quality);
                average = $"{averageHours:0.0} hours and quality {averageQuality:0.0}/10 over {logsInWeekBefore.Count} nights.";
            }

            var sleepGoals = await GetUserSleepGoals(userId);

            // the message we send to Claude, with the last night log taken from DescribeNight() and the average of the week before above
            var message = $"""
                Last night: {DescribeNight(lastNight)}
                My average the week before: {average}
                My sleep goals: {sleepGoals}
                """;

            var feedback = await AskClaudeAsync(LastNightPrompt, message);
            if (feedback != RefusalMessage && !string.IsNullOrWhiteSpace(feedback))
            {
                lastNight.LastNightFeedback = feedback;
                // need to use Update() because lastNight was retrieved with AsNoTracking()
                _context.SleepLogs.Update(lastNight);
                await _context.SaveChangesAsync();
            }
            return feedback;
        }

        // a review of one whole month (the controller checks the month is valid and finished)
        public async Task<string> GetMonthlyFeedbackAsync(int userId, int year, int month)
        {
            // already reviewed this month? reuse it so we don't pay Claude again
            var savedReview = await _context.MonthlyReviews
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.UserId == userId && r.Year == year && r.Month == month);

            if (savedReview != null)
            {
                return savedReview.Review;
            }

            // a date range instead of .Year/.Month so the (UserId, Date) index gets used
            var monthStart = new DateOnly(year, month, 1);
            var nextMonthStart = monthStart.AddMonths(1);

            var logsInMonth = await _context.SleepLogs
                .AsNoTracking()
                .Where(s => s.UserId == userId && s.Date >= monthStart && s.Date < nextMonthStart)
                .OrderBy(s => s.Date)
                .ToListAsync();

            // not worth asking Claude about only a few nights
            if (logsInMonth.Count < 7)
            {
                return "Log at least 7 nights in a month to get your monthly review.";
            }

            var averageHours = logsInMonth.Average(s => (s.WakeUpTime - s.Bedtime).TotalHours);
            var averageQuality = logsInMonth.Average(s => s.Quality);

            var message = $"My sleep in {monthStart:MMMM yyyy} ({logsInMonth.Count} nights logged):\n";
            message += $"Average: {averageHours:0.0} hours and quality {averageQuality:0.0}/10\n";
            message += $"My sleep goals: {await GetUserSleepGoals(userId)}\n\n";

            foreach (var log in logsInMonth)
            {
                message += $"- {DescribeNight(log)}\n";
            }

            var review = await AskClaudeAsync(MonthlyPrompt, message);

            // only save a real review, so a refusal or empty answer can be tried again later
            if (review != RefusalMessage && !string.IsNullOrWhiteSpace(review))
            {
                _context.MonthlyReviews.Add(new MonthlyReview
                {
                    UserId = userId,
                    Year = year,
                    Month = month,
                    Review = review,
                    CreatedAt = DateTime.UtcNow
                });
                await _context.SaveChangesAsync();
            }

            return review;
        }

        // what we show when Claude says no
        private const string RefusalMessage = "Sorry, the Lights Off coach couldn't give feedback this time.";


        // sends the prompt to Claude and returns its answer
        private async Task<string> AskClaudeAsync(string prompt, string message)
        {
            var parameters = new MessageCreateParams
            {
                Model = "claude-opus-5-5",
                MaxTokens = 2000,
                System = prompt,
                Messages = [new UserMessageParam { Content = message }],
            };

            var response = await _anthropicClient.Messages.Create(parameters);

            // Claude's safety filters can say no, so check before reading the answer
            if (response.StopReason == "refusal")
            {
                return RefusalMessage;
            }

            var answer = "";
            foreach (var block in response.Content)
            {
                // skip the thinking blocks, only keep the text
                if (block.TryPickText(out var textBlock))
                {
                    answer += textBlock.Text;
                }
            }
            return answer;
        }

        // one night as a line of text for Claude
        private static string DescribeNight(SleepLog sleepLog)
        {
            var hours = (sleepLog.WakeUpTime - sleepLog.Bedtime).TotalHours;

            return $"{sleepLog.Date:ddd d MMM}: slept {hours:0.0} hours, quality {sleepLog.Quality}/10, "
                + $"caffeine after 3pm: {sleepLog.CaffeineAfter3pm?.ToString() ?? "not answered"}, "
                + $"exercised: {sleepLog.Exercised?.ToString() ?? "not answered"}, "
                + $"stress: {sleepLog.StressLevel?.ToString() ?? "not answered"}, "
                + $"screen time before bed: {sleepLog.ScreenTimeBeforeBed?.ToString() ?? "not answered"}, "
                + $"nap: {sleepLog.AfternoonNapDuration?.ToString() ?? "not answered"}";
        }

        // Helper method to get the latest log for a user
        private async Task<SleepLog?> GetLatestLogAsync(int userId)
        {
            return await _context.SleepLogs
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.Date)
                .FirstOrDefaultAsync();
        }

        // Helper method to get the logs in the week before a given date for a user
        private async Task<List<SleepLog>> GetLogsInWeekBeforeAsync(int userId, DateOnly date)
        {
            var weekStart = date.AddDays(-7);

            return await _context.SleepLogs
                .AsNoTracking()
                .Where(s => s.UserId == userId && s.Date >= weekStart && s.Date < date)
                .OrderBy(s => s.Date)
                .ToListAsync();
        }

        private async Task<string> GetUserSleepGoals(int userId) 
        {
            var goals = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => u.SleepGoals)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (goals == null || goals.Count == 0)
            {
                return "None picked";
            }

            return string.Join(", ", goals);
        }
    }
}
