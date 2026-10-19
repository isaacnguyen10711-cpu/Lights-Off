using Microsoft.EntityFrameworkCore;
using Lights_Off.Models;
namespace Lights_Off.Data
{
    public class LightsOffDbContext : DbContext
    {
        public LightsOffDbContext(DbContextOptions<LightsOffDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<SleepLog> SleepLogs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the User entity with database unique index
            modelBuilder.Entity<User>()
                .HasIndex(u => u.OAuthProviderId)
                .IsUnique();

            // Configure the SleepLog entity with a unique index on UserId and Date because a user can only have one sleep log per day
            modelBuilder.Entity<SleepLog>()
                .HasIndex(s => new { s.UserId, s.Date })
                .IsUnique();
        }

    }

}
