using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lights_Off.Migrations
{
    /// <inheritdoc />
    public partial class AllowMultipleSleepGoals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SleepGoals",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            // move each user's old goal into the new list (1 becomes [1]) so nobody loses it
            migrationBuilder.Sql(
                "UPDATE AspNetUsers SET SleepGoals = '[' + CAST(SleepGoal AS nvarchar(10)) + ']' WHERE SleepGoal IS NOT NULL");

            migrationBuilder.DropColumn(
                name: "SleepGoal",
                table: "AspNetUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SleepGoals",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "SleepGoal",
                table: "AspNetUsers",
                type: "int",
                nullable: true);
        }
    }
}
