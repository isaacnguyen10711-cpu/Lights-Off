using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lights_Off.Models;
using Lights_Off.Data;

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
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SleepLog>>> GetSleepLog()
    {
        return await _context.SleepLogs.ToListAsync();
    }

    // GET: api/SleepLog/5
    [HttpGet("{sleeplogid}")]
    public async Task<ActionResult<SleepLog>> GetSleepLog(int sleeplogid)
    {
        var sleeplog = await _context.SleepLogs.FindAsync(sleeplogid);

        if (sleeplog == null)
        {
            return NotFound();
        }

        return sleeplog;
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
