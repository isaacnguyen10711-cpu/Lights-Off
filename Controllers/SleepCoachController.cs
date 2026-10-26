using Lights_Off.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Lights_Off.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SleepCoachController : ControllerBase
    {
        private readonly ISleepCoach _sleepCoach;

        public SleepCoachController(ISleepCoach sleepCoach)
        {
            _sleepCoach = sleepCoach;
        }

        // GET: api/SleepCoach/last-night
        [Authorize]
        [HttpGet("last-night")]
        public async Task<IActionResult> GetLastNightReview()
        {
            var review = await _sleepCoach.GetLastNightFeedbackAsync(GetUserId());
            return Ok(new { review });
        }

        // GET: api/SleepCoach/monthly?year=2026&month=10
        [Authorize]
        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlyReview([FromQuery] int year, [FromQuery] int month)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            if (month < 1 || month > 12)
            {
                return BadRequest("Month must be between 1 and 12.");
            }

            if (year < 2000 || year > today.Year)
            {
                return BadRequest($"Year must be between 2000 and {today.Year}.");
            }

            // unlocks on the 2nd of the next month, not the 1st, because the server runs on UTC
            // and some time zones are still finishing the month on the 1st
            var monthStart = new DateOnly(year, month, 1);
            var unlockDate = monthStart.AddMonths(1).AddDays(1);

            if (today < unlockDate)
            {
                return BadRequest($"Your {monthStart:MMMM} review will be ready on {unlockDate:d MMMM}.");
            }

            var review = await _sleepCoach.GetMonthlyFeedbackAsync(GetUserId(), year, month);
            return Ok(new { review });
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
    }
}
