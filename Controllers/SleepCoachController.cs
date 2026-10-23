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
        [HttpGet("last-night")]
        public async Task<IActionResult> GetLastNightFeedback()
        {
            var feedback = await _sleepCoach.GetLastNightFeedbackAsync(GetUserId());
            return Ok(new { feedback });
        }

        // GET: api/SleepCoach/weekly
        [HttpGet("weekly")]
        public async Task<IActionResult> GetWeeklyReview()
        {
            var review = await _sleepCoach.GetWeeklyReviewAsync(GetUserId());
            return Ok(new { review });
        }

        // [Authorize] makes sure this claim is always there
        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
    }
}
