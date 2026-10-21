using Lights_Off.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Lights_Off.Models;
using Microsoft.AspNetCore.Identity;

namespace Lights_Off.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AuthenticationController(SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
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
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return Challenge(properties, provider);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback()
        {
            // After login, get the user's provider ID claim (its Issuer says which provider they used)
            var userInfo = await _signInManager.GetExternalLoginInfoAsync();

            if (userInfo == null)
            {
                return Unauthorized("Unauthorized access.");
            }

            // Check if the user already exists in the database
            var signInResult = await _signInManager.ExternalLoginSignInAsync(userInfo.LoginProvider, userInfo.ProviderKey, isPersistent: true);
            
            if (!signInResult.Succeeded)
            {
                // If the user does not exist, create a new user with the information from the external provider
                var email = userInfo.Principal.FindFirstValue(ClaimTypes.Email);
                var displayName = userInfo.Principal.FindFirstValue(ClaimTypes.Name);

                var newUser = new User
                {
                    UserName = email ?? $"{userInfo.LoginProvider}_{userInfo.ProviderKey}",
                    Email = email,
                    DisplayName = displayName ?? "Unknown",
                };

                // Create the new user in the database
                var response = await _userManager.CreateAsync(newUser);
                if (!response.Succeeded)
                {
                    return BadRequest(response.Errors);
                }

                // Associate the external login with the newly created user
                await _userManager.AddLoginAsync(newUser, userInfo);

                // Sign in the newly created user
                await _signInManager.SignInAsync(newUser, isPersistent: true, userInfo.LoginProvider);
            }

            // If the user already exists, sign them in and redirect to the "me" endpoint to get their information
            return Redirect("/api/authentication/me"); 
        }

        // Separate endpoint to get the current authenticated user's information
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new
            {
                user.Id,
                user.Email,
                user.UserName,
                user.DisplayName,
                user.SleepGoal
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // Sign out by deleting the login cookie (the default Cookies scheme)
            await _signInManager.SignOutAsync();
            return NoContent();
        }
    }
}
