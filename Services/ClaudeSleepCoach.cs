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

            Give short feedback on that night:
            - Say how it compares to their usual sleep.
            - If something like caffeine, exercise, stress, screen time or a nap stands out, mention it.
            - End with one small, practical tip for tonight.
            - Keep it to 2-3 sentences, friendly and in plain English.
            - Only use the data you were given, don't make anything up.

            You give general sleep tips, not medical advice. Don't diagnose anything.
            """;

        // instructions for the bigger weekly review
        private const string WeeklyPrompt = """
            You are the sleep coach inside Lights Off, a sleep tracking app.
            You'll get the user's sleep from the last 7 days: their averages and the details of each night.

            Write a short weekly review:
            - Start with one or two sentences about the overall pattern (hours, quality, consistency).
            - Point out up to three things that seem linked to better or worse sleep.
            - Give two or three specific, realistic tips for next week.
            - With only a few nights logged, say the patterns are rough rather than overclaiming.
            - Keep it friendly, under 200 words and in plain English.
            - Only use the data you were given, don't make anything up.

            You give general sleep tips, not medical advice. Don't diagnose anything.
            If they're regularly sleeping under 5 hours or sleeping badly most nights, suggest they talk to a doctor.
            """;

        public async Task<string> GetLastNightFeedbackAsync(int userId)
        {
            // their most recent night
            var lastNight = await _context.SleepLogs
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.Date)
                .FirstOrDefaultAsync();

            if (lastNight == null)
            {
                return "Log your first night of sleep to get feedback.";
            }

            // the week before it, so Claude has something to compare with
            var weekStart = lastNight.Date.AddDays(-7);
            var nightsInWeekBefore = await _context.SleepLogs
                .AsNoTracking()
                .Where(s => s.UserId == userId && s.Date >= weekStart && s.Date < lastNight.Date)
                .ToListAsync();

            // if there are no earlier nights, we can't give an average
            var average = "No earlier nights logged yet.";
            if (nightsInWeekBefore.Count > 0)
            {
                var averageHours = nightsInWeekBefore.Average(s => (s.WakeUpTime - s.Bedtime).TotalHours);
                var averageQuality = nightsInWeekBefore.Average(s => s.Quality);
                average = $"{averageHours:0.0} hours and quality {averageQuality:0.0}/10 over {nightsInWeekBefore.Count} nights.";
            }

            // the message we send to Claude, with the last night log taken from DescribeNight() and the average of the week before above
            var message = $"""
                Last night: {DescribeNight(lastNight)}
                My average the week before: {average}
                """;

            return await AskClaudeAsync(LastNightPrompt, message);
        }

        public async Task<string> GetWeeklyReviewAsync(int userId)
        {
            // the week is the 7 days before their latest log (not the server's date)
            var latestLog = await _context.SleepLogs
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.Date)
                .FirstOrDefaultAsync();

            if (latestLog == null)
            {
                return "Log a few nights of sleep to get your weekly review.";
            }

            // last night has its own feedback, so leave it out of the week
            var weekStart = latestLog.Date.AddDays(-7);
            var nightsInWeekBefore = await _context.SleepLogs
                .AsNoTracking()
                .Where(s => s.UserId == userId && s.Date >= weekStart && s.Date < latestLog.Date)
                .OrderBy(s => s.Date)
                .ToListAsync();

            // not worth asking Claude about 1 or 2 nights
            if (nightsInWeekBefore.Count < 3)
            {
                return "Log at least 3 nights this week to get a weekly review.";
            }

            var averageHours = nightsInWeekBefore.Average(s => (s.WakeUpTime - s.Bedtime).TotalHours);
            var averageQuality = nightsInWeekBefore.Average(s => s.Quality);

            var message = $"My sleep over the 7 days before last night ({nightsInWeekBefore.Count} nights logged):\n";
            message += $"Average: {averageHours:0.0} hours and quality {averageQuality:0.0}/10\n\n";

            foreach (var night in nightsInWeekBefore)
            {
                message += $"- {DescribeNight(night)}\n";
            }

            return await AskClaudeAsync(WeeklyPrompt, message);
        }

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
                return "Sorry, the Lights Off coach couldn't give feedback this time.";
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
    }
}
