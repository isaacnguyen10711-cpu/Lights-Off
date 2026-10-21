using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lights_Off.Models;
using Lights_Off.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Lights_Off.Models.DTOs;

[Route("api/[controller]")]
[ApiController]
public class SleepLogsController : ControllerBase
{
    private readonly LightsOffDbContext _context;
    public SleepLogsController(LightsOffDbContext context)
    {
        _context = context;
    }

    // GET: api/SleepLog
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SleepLogResponse>>> GetSleepLog()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var allSleepLog = _context.SleepLogs
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.Date)
            .Select(s => new SleepLogResponse
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
                AfternoonNapDuration = s.AfternoonNapDuration
            });

        return await allSleepLog.ToListAsync();
    }

    // GET: api/SleepLog/5
    [Authorize]
    [HttpGet("{sleeplogid}")]
    public async Task<ActionResult<SleepLogResponse>> GetSleepLog(int sleeplogid)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var sleepLog = await _context.SleepLogs
            .AsNoTracking()
            .Where(s => s.SleepLogId == sleeplogid && s.UserId == userId)
            .Select(s => new SleepLogResponse
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
                AfternoonNapDuration = s.AfternoonNapDuration
            })
            .FirstOrDefaultAsync();

        if (sleepLog == null)
        {
            return NotFound();
        }

        return sleepLog;
    }

    // PUT: api/SleepLog/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{sleeplogid}")]
    public async Task<IActionResult> PutSleepLog(int? sleeplogid, SleepLog sleeplog)
    {
        if (sleeplogid != sleeplog.SleepLogId)
        {
            return BadRequest();
        }

        _context.Entry(sleeplog).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SleepLogExists(sleeplogid))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/SleepLog
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<SleepLog>> PostSleepLog(SleepLog sleeplog)
    {
        _context.SleepLogs.Add(sleeplog);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetSleepLog", new { sleeplogid = sleeplog.SleepLogId }, sleeplog);
    }

    // DELETE: api/SleepLog/5
    [HttpDelete("{sleeplogid}")]
    public async Task<IActionResult> DeleteSleepLog(int? sleeplogid)
    {
        var sleeplog = await _context.SleepLogs.FindAsync(sleeplogid);
        if (sleeplog == null)
        {
            return NotFound();
        }

        _context.SleepLogs.Remove(sleeplog);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool SleepLogExists(int? sleeplogid)
    {
        return _context.SleepLogs.Any(e => e.SleepLogId == sleeplogid);
    }
}
