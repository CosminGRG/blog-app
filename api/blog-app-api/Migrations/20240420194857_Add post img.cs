using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogApp_API.Migrations
{
    /// <inheritdoc />
    public partial class Addpostimg : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PostImgPath",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PostImgPath",
                table: "Posts");
        }
    }
}
