using System.ComponentModel.DataAnnotations;

namespace BlogApp_API.Models;

public class Post 
{
    public Post()
    {
        Comments = new HashSet<Comment>();
        Tags = new HashSet<Tag>();
    }

    [Key]
    public int Id { get; set; }
    [Required]
    public string Title { get; set; }
    [Required]
    public string Content { get; set; }
    [Required]
    public string PostImgPath {get; set; }
    [Required]
    public DateTime insDateTime { get; set; }
    [Required]
    public DateTime updDateTime {get; set; }
    public virtual User User { get; set; }
    public virtual ICollection<Comment> Comments { get; set; } = [];
    public virtual ICollection<Tag> Tags{ get; set; } = [];
}