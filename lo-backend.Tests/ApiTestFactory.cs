using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Lights_Off.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Lights_Off.Services;
using lo_backend.Tests;
using System.Threading.Tasks;

namespace lo_backend.Tests
{
    public class ApiTestFactory : WebApplicationFactory<Program>
    {
        private readonly SqliteConnection _connection = new("DataSource=:memory:");
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Remove the existing DbContext registration
                services.RemoveAll<DbContextOptions<LightsOffDbContext>>();
                services.RemoveAll<IDbContextOptionsConfiguration<LightsOffDbContext>>();

                // Add a new DbContext using Sqlite in-memory database for testing
                _connection.Open();
                services.AddDbContext<LightsOffDbContext>(options =>
                {
                    options.UseSqlite(_connection);
                });

                services.RemoveAll<ISleepCoach>();
                services.AddScoped<ISleepCoach, FakeSleepCoach>();

            });
        }
    }
}
