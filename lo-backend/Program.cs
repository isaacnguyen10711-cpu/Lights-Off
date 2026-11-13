using Anthropic;
using Lights_Off.Data;
using Lights_Off.Models;
using Lights_Off.Services.SleepCoachService;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.RateLimiting;
using System.Security.Claims;
using Lights_Off.Services.EmailService;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<LightsOffDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// ASP.NET Core Identity with email confirmation required
builder.Services.AddIdentityApiEndpoints<User>(options =>
{
    options.SignIn.RequireConfirmedEmail = true;
})
    .AddEntityFrameworkStores<LightsOffDbContext>();

// the frontend (http) and API (https) count as different sites, so the login cookie
// needs SameSite=None to be sent with fetch. None only works with Secure (https only)
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// Google + Facebook, added on top of Identity
builder.Services.AddAuthentication()
    .AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
        googleOptions.SignInScheme = IdentityConstants.ExternalScheme;
        googleOptions.Events.OnRemoteFailure = context =>
        {
            // they cancelled or it failed on the provider's side, so send them back to the login page
            context.Response.Redirect(builder.Configuration["Frontend:Url"] + "/?error=login-cancelled");
            // stops ASP.NET showing its own error page
            context.HandleResponse(); 
            return Task.CompletedTask;
        };
    })
    .AddFacebook(facebookOptions =>
    {
        facebookOptions.AppId = builder.Configuration["Authentication:Facebook:AppId"]!;
        facebookOptions.AppSecret = builder.Configuration["Authentication:Facebook:AppSecret"]!;
        facebookOptions.SignInScheme = IdentityConstants.ExternalScheme;
        facebookOptions.Events.OnRemoteFailure = context =>
        {
            // they cancelled or it failed on the provider's side, so send them back to the login page
            context.Response.Redirect(builder.Configuration["Frontend:Url"] + "/?error=login-cancelled");
            // stops ASP.NET showing its own error page
            context.HandleResponse(); 
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddRateLimiter(options =>
{
    // Too Many Requests so that devs can know when they are hitting the limit, rather than a 500 error
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("AIFeedbackRequest", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
            }
        )
    );
});


// one shared Claude client for the whole app
builder.Services.AddSingleton(new AnthropicClient
{
    ApiKey = builder.Configuration["Anthropic:Api:Key"]
});

builder.Services.AddScoped<ISleepCoach, ClaudeSleepCoach>();

builder.Services.AddSingleton(new SmtpSettings
{
    Server = builder.Configuration["Smtp:Server"]!,
    Port = int.Parse(builder.Configuration["Smtp:Port"]!),
    SenderName = builder.Configuration["Smtp:SenderName"]!,
    SenderEmail = builder.Configuration["Smtp:SenderEmail"]!,
    Username = builder.Configuration["Smtp:Username"]!,
    Password = builder.Configuration["Smtp:Password"]!
});

builder.Services.AddTransient<IEmailSender<User>, Mailer>();


// let the Next.js frontend call this API from the browser (with the login cookie)
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Lights Off API V1"));
}


app.UseHttpsRedirection();

// has to come before auth so the browser's preflight check isn't blocked
app.UseCors("Frontend");

app.UseAuthentication();

app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers();
app.MapGroup("/api/identity").MapIdentityApi<User>();

app.Run();
