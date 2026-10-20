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
            // One account per provider ID: Google and Facebook IDs could clash, so the provider is part of the index
            modelBuilder.Entity<User>()
                .HasIndex(u => new { u.OAuthProvider, u.OAuthProviderId })
                .IsUnique();

            // Configure the SleepLog entity with a unique index on UserId and Date because a user can only have one sleep log per day
            modelBuilder.Entity<SleepLog>()
                .HasIndex(s => new { s.UserId, s.Date })
                .IsUnique();
        }

    }

}
