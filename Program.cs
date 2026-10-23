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

// Google + Facebook, added on top of Identity
builder.Services.AddAuthentication()
    .AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
        googleOptions.SignInScheme = IdentityConstants.ExternalScheme;
    })
    .AddFacebook(facebookOptions =>
    {
        facebookOptions.AppId = builder.Configuration["Authentication:Facebook:AppId"]!;
        facebookOptions.AppSecret = builder.Configuration["Authentication:Facebook:AppSecret"]!;
        facebookOptions.SignInScheme = IdentityConstants.ExternalScheme;
    });

builder.Services.AddAuthorization();

// one shared Claude client for the whole app
builder.Services.AddSingleton(new AnthropicClient
{
    ApiKey = builder.Configuration["Anthropic:Api:Key"]
});

builder.Services.AddScoped<ISleepCoach, ClaudeSleepCoach>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Lights Off API V1"));
}


app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.MapGroup("/api/identity").MapIdentityApi<User>();

app.Run();
