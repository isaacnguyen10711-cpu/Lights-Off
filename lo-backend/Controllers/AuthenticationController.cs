using Lights_Off.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Lights_Off.Models;
using Lights_Off.Models.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Lights_Off.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public AuthenticationController(SignInManager<User> signInManager, UserManager<User> userManager, IConfiguration configuration)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
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
                return Redirect(_configuration["Frontend:Url"] + "/?error=login-failed");
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
                    DisplayName = displayName,
                };

                var response = await _userManager.CreateAsync(newUser);
                if (!response.Succeeded)
                {
                    // their email already has an account (made with another sign in method)
                    // email can be null, e.g. Facebook accounts made with a phone number
                    if (email != null && await _userManager.FindByEmailAsync(email) != null)
                    {
                        return Redirect(_configuration["Frontend:Url"] + "/?error=email-taken");
                    }

                    // anything else is unexpected, so just say it didn't work
                    return Redirect(_configuration["Frontend:Url"] + "/?error=login-failed");
                }

                // Associate the external login with the newly created user
                var linkResult = await _userManager.AddLoginAsync(newUser, userInfo);
                if (!linkResult.Succeeded)
                {
                    return Redirect(_configuration["Frontend:Url"] + "/?error=login-failed");
                }

                // Sign in the newly created user
                await _signInManager.SignInAsync(newUser, isPersistent: true, userInfo.LoginProvider);
            }

            // logged in, send them back to the website
            return Redirect(_configuration["Frontend:Url"] + "/home");
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
                user.SleepGoal,
                // google and facebook users have no password, so the profile page hides "change password" for them
                HasPassword = await _userManager.HasPasswordAsync(user)
            });
        }

        // lets the user change their name and sleep goal
        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateCurrentUser(ProfileUpdateRequest request)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.DisplayName = request.DisplayName;
            user.SleepGoal = request.SleepGoal;

            // identity has its own save for users, so use that instead of SaveChangesAsync
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest("Couldn't save your profile.");
            }

            return NoContent();
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
