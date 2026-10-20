using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lights_Off.Migrations
{
    /// <inheritdoc />
    public partial class RenameProviderToOAuthProvider : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Provider",
                table: "Users",
                newName: "OAuthProvider");

            migrationBuilder.RenameIndex(
                name: "IX_Users_Provider_OAuthProviderId",
                table: "Users",
                newName: "IX_Users_OAuthProvider_OAuthProviderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OAuthProvider",
                table: "Users",
                newName: "Provider");

            migrationBuilder.RenameIndex(
                name: "IX_Users_OAuthProvider_OAuthProviderId",
                table: "Users",
                newName: "IX_Users_Provider_OAuthProviderId");
        }
    }
}
