using Anthropic;
using Lights_Off.Data;
using Lights_Off.Models;
using Lights_Off.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<LightsOffDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add authentication services with cookie authentication and Google OAuth
builder.Services.AddIdentityApiEndpoints<User>()
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
            context.HandleResponse(); // stops ASP.NET showing its own error page
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
            context.HandleResponse(); // stops ASP.NET showing its own error page
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();

// one shared Claude client for the whole app
builder.Services.AddSingleton(new AnthropicClient
{
    ApiKey = builder.Configuration["Anthropic:Api:Key"]
});

builder.Services.AddScoped<ISleepCoach, ClaudeSleepCoach>();

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

app.MapControllers();
app.MapGroup("/api/identity").MapIdentityApi<User>();

app.Run();
