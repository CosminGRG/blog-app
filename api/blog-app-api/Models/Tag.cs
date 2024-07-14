using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BlogApp_API.Models;

public class Tag 
{
    public Tag()
    {
        Posts = new HashSet<Post>();
    }

    [Key]
    public int Id { get; set; }

    [Required]
    public string TagName { get; set; }
    
    [JsonIgnore]
    public virtual ICollection<Post> Posts{ get; }
}