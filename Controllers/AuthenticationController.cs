using Lights_Off.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Lights_Off.Models;

namespace Lights_Off.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly LightsOffDbContext _context;
        
        public AuthenticationController(LightsOffDbContext context)
        {
            _context = context;
        }

        // Implement OAuth structural layout with 4 endpoints: login, callback, me, and logout

        [HttpGet("login")]
        public IActionResult Login()
        {
            // Redirect to Google for authentication
            var redirectUrl = "/api/authentication/callback";
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, "Google");
        }

        [Authorize]
        [HttpGet("callback")]
        public async Task<IActionResult> Callback()
        {
            // After successful authentication, retrieve the user's Google ID from the claims
            var googleId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.OAuthProviderId == googleId);

            if (user == null)
            {
                // If the user does not exist, create a new user
                user = new User
                {
                    OAuthProviderId = googleId!,
                    UserName = User.FindFirstValue(ClaimTypes.Name)!,
                    Email = User.FindFirstValue(ClaimTypes.Email)!
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            return Redirect("/api/authentication/me");
        }

        // Separate endpoint to get the current authenticated user's information
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            var googleId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.OAuthProviderId == googleId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Sign out the user and clear the default authentication scheme (Google) cookie
            await HttpContext.SignOutAsync();
            return NoContent();
        }
    }
}
