using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lights_Off.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OAuthProviderId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SleepGoal = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "SleepLogs",
                columns: table => new
                {
                    SleepLogId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Bedtime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WakeUpTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Quality = table.Column<int>(type: "int", nullable: false),
                    CaffeineAfter3pm = table.Column<bool>(type: "bit", nullable: true),
                    Exercised = table.Column<bool>(type: "bit", nullable: true),
                    StressLevel = table.Column<int>(type: "int", nullable: true),
                    ScreenTimeBeforeBed = table.Column<int>(type: "int", nullable: true),
                    AfternoonNapDuration = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SleepLogs", x => x.SleepLogId);
                    table.ForeignKey(
                        name: "FK_SleepLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SleepLogs_UserId_Date",
                table: "SleepLogs",
                columns: new[] { "UserId", "Date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_OAuthProviderId",
                table: "Users",
                column: "OAuthProviderId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SleepLogs");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
