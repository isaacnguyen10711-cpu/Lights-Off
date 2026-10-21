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
        public IActionResult Login([FromQuery] string? provider)
        {
            if (provider != "Google" && provider != "Facebook")
            {
                return BadRequest("Invalid provider. Only 'Google' and 'Facebook' are supported.");
            }

            // Redirect to the chosen provider (Google or Facebook) to log in
            var redirectUrl = "/api/authentication/callback";
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl, IsPersistent = true };
            return Challenge(properties, provider);
        }

        [Authorize]
        [HttpGet("callback")]
        public async Task<IActionResult> Callback()
        {
            // After login, get the user's provider ID claim (its Issuer says which provider they used)
            var providerClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            // Check the provider and provider ID from the claims
            var user = await FindUser(providerClaim!);
            if (user == null)
            {
                // If the user does not exist, create a new user
                user = new User
                {
                    OAuthProviderId = providerClaim!.Value,
                    OAuthProvider = providerClaim.Issuer,
                    UserName = User.FindFirstValue(ClaimTypes.Name)!,
                    Email = User.FindFirstValue(ClaimTypes.Email)
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            return Redirect("/api/authentication/me");
        }

        // Separate endpoint to get the current authenticated user's information
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var providerClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            // Check the provider and provider ID from the claims
            var user = await FindUser(providerClaim!);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(new
            {
                user.UserId,
                user.Email,
                user.UserName,
                user.SleepGoal
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Sign out by deleting the login cookie (the default Cookies scheme)
            await HttpContext.SignOutAsync();
            return NoContent();
        }

        private async Task<User?> FindUser(Claim providerClaim)
        {
            // Check the provider and provider ID from the claims
            var provider = providerClaim!.Issuer;
            var providerId = providerClaim.Value;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.OAuthProviderId == providerId && u.OAuthProvider == provider);
            return user;
        }
    }
}
