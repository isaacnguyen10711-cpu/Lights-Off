using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lights_Off.Migrations
{
    /// <inheritdoc />
    public partial class AddProviderToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_OAuthProviderId",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256);

            migrationBuilder.AddColumn<string>(
                name: "Provider",
                table: "Users",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            // Every user before this migration signed in with Google
            migrationBuilder.Sql("UPDATE Users SET Provider = 'Google'");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Provider_OAuthProviderId",
                table: "Users",
                columns: new[] { "Provider", "OAuthProviderId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Provider_OAuthProviderId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Provider",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_OAuthProviderId",
                table: "Users",
                column: "OAuthProviderId",
                unique: true);
        }
    }
}
