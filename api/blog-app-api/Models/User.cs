using System.ComponentModel.DataAnnotations;

namespace BlogApp_API.Models;

public class User 
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Username { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [MinLength(8, ErrorMessage = "The password must be at least 8 characters long.")]
    [MaxLength(64, ErrorMessage = "The password cannot exceed 64 characters.")]
    public string Password { get; set; } 

    [Required]
    public byte[] PasswordSalt { get; set; }

    public string? ProfilePicturePath { get; set; }

    public int RoleId { get; set; }
    public virtual Role Role { get; set; }
}