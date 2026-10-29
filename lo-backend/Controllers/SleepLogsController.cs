using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lights_Off.Models;
using Lights_Off.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Lights_Off.Models.DTOs;
using Lights_Off.Filters;

[Route("api/[controller]")]
[ApiController]
public class SleepLogsController : ControllerBase
{
    private readonly LightsOffDbContext _context;
    public SleepLogsController(LightsOffDbContext context)
    {
        _context = context;
    }

    // GET: api/SleepLogs?year=2026&month=10
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SleepLogResponse>>> GetAllSleepLogInAMonth([FromQuery] int year, [FromQuery] int month)
    {
        var userId = GetUserId();

        // DateOnly crashes on silly years like 0, so stop them here with a 400 instead
        if (year < 2000 || year > 2100)
        {
            return BadRequest("Year must be between 2000 and 2100.");
        }

        if (month < 1 || month > 12)
        {
            return BadRequest("Month must be between 1 and 12.");
        }

        var monthStart = new DateOnly(year, month, 1);
        var nextMonthStart = monthStart.AddMonths(1);

        var sleepLogInTheMonth = _context.SleepLogs
            .AsNoTracking()
            .Where(s => s.UserId == userId && s.Date >= monthStart && s.Date < nextMonthStart)
            .OrderBy(s => s.Date)
            // use the DTO helper method to convert to the response model
            .Select(s => SleepLogResponse.Create(s));

        return await sleepLogInTheMonth.ToListAsync();
    }

    // GET: api/SleepLog/5
    [Authorize]
    [HttpGet("{sleeplogid}")]
    public async Task<ActionResult<SleepLogResponse>> GetSleepLog(int sleeplogid)
    {
        var userId = GetUserId();
        var sleepLog = await _context.SleepLogs
            .AsNoTracking()
            .Where(s => s.SleepLogId == sleeplogid && s.UserId == userId)
            // use the DTO helper method to convert to the response model
            .Select(s => SleepLogResponse.Create(s))
            .FirstOrDefaultAsync();

        if (sleepLog == null)
        {
            return NotFound();
        }

        return sleepLog;
    }

    // GET : api/SleepLog/latest-log
    [Authorize]
    [HttpGet("latest-log")]
    public async Task<ActionResult<SleepLogResponse>> GetLatestSleepLog()
    {
        var userId = GetUserId();
        var sleepLog = await _context.SleepLogs
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.Date)
            // use the DTO helper method to convert to the response model
            .Select(s => SleepLogResponse.Create(s))
            .FirstOrDefaultAsync();

        if (sleepLog == null)
        {
            return NotFound();
        }

        return sleepLog;
    }

    // PUT: api/SleepLogs/5
    [Authorize]
    [ValidateBedTimeAndWakeUpTime]
    [HttpPut("{sleeplogid}")]
    public async Task<IActionResult> PutSleepLog(int sleeplogid, SleepLogRequest sleeplog)
    {
        var userId = GetUserId();

        // FindAsync keeps tracking it, so EF picks up the changes below
        var existingLog = await _context.SleepLogs.FindAsync(sleeplogid);

        // 404 if it doesn't exist or it's someone else's
        if (existingLog == null || existingLog.UserId != userId)
        {
            return NotFound();
        }

        var date = DateOnly.FromDateTime(sleeplog.WakeUpTime);

        // only one log per day, but skip this log itself
        var dateTaken = await _context.SleepLogs
            .AnyAsync(s => s.UserId == userId && s.Date == date && s.SleepLogId != sleeplogid);

        if (dateTaken)
        {
            return Conflict("You already logged sleep for this date.");
        }

        existingLog.Date = date;
        existingLog.Bedtime = sleeplog.Bedtime;
        existingLog.WakeUpTime = sleeplog.WakeUpTime;
        existingLog.Quality = sleeplog.Quality;
        existingLog.CaffeineAfter3pm = sleeplog.CaffeineAfter3pm;
        existingLog.Exercised = sleeplog.Exercised;
        existingLog.StressLevel = sleeplog.StressLevel;
        existingLog.ScreenTimeBeforeBed = sleeplog.ScreenTimeBeforeBed;
        existingLog.AfternoonNapDuration = sleeplog.AfternoonNapDuration;

        // clear feedback so it can be regenerated with the new data
        existingLog.LastNightFeedback = null;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/SleepLog
    [Authorize]
    [ValidateBedTimeAndWakeUpTime]
    [HttpPost]
    public async Task<ActionResult<SleepLogResponse>> PostSleepLog(SleepLogRequest sleeplog)
    {
        var userId = GetUserId();

        // the log belongs to the day they woke up
        var date = DateOnly.FromDateTime(sleeplog.WakeUpTime);

        // only one log per day
        var alreadyLogged = await _context.SleepLogs
            .AnyAsync(s => s.UserId == userId && s.Date == date);

        if (alreadyLogged)
        {
            return Conflict("You already logged sleep for this date.");
        }

        var newSleepLog = new SleepLog
        {
            UserId = userId,
            Date = date,
            Bedtime = sleeplog.Bedtime,
            WakeUpTime = sleeplog.WakeUpTime,
            Quality = sleeplog.Quality,
            CaffeineAfter3pm = sleeplog.CaffeineAfter3pm,
            Exercised = sleeplog.Exercised,
            StressLevel = sleeplog.StressLevel,
            ScreenTimeBeforeBed = sleeplog.ScreenTimeBeforeBed,
            AfternoonNapDuration = sleeplog.AfternoonNapDuration
        };

        _context.SleepLogs.Add(newSleepLog);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSleepLog), new { sleeplogid = newSleepLog.SleepLogId }, SleepLogResponse.Create(newSleepLog));
    }

    // [Authorize] makes sure this claim is always there
    private int GetUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}
