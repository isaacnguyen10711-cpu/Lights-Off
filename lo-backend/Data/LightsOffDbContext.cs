using Microsoft.EntityFrameworkCore;
using Lights_Off.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
namespace Lights_Off.Data
{
    public class LightsOffDbContext : IdentityDbContext<User, IdentityRole<int>, int >
    {
        public LightsOffDbContext(DbContextOptions<LightsOffDbContext> options) : base(options)
        {
        }
        public DbSet<SleepLog> SleepLogs { get; set; } = null!;
        public DbSet<MonthlyReview> MonthlyReviews { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the SleepLog entity with a unique index on UserId and Date because a user can only have one sleep log per day
            modelBuilder.Entity<SleepLog>()
                .HasIndex(s => new { s.UserId, s.Date })
                .IsUnique(); 

            // one saved review per user per month
            modelBuilder.Entity<MonthlyReview>()
                .HasIndex(r => new { r.UserId, r.Year, r.Month })
                .IsUnique();
        }

    }

}
