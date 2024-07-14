using System.ComponentModel.DataAnnotations;

namespace BlogApp_API.Models;

public class Comment 
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Content { get; set; }
    [Required]
    public DateTime dateTime { get; set; }
    public virtual User User { get; set; }
    public int PostId { get; set; }
    public Post Post { get; set; } = null!;
}