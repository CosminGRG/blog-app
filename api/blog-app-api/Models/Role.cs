using System.ComponentModel.DataAnnotations;

namespace BlogApp_API.Models;

public class Role 
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string RoleName { get; set; }
}