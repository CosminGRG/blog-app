
namespace BlogApp_API.ViewModels;

public class PostDTO
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public string PostImgPath { get; set; }
    public DateTime InsDateTime { get; set; }
    public DateTime UpdDateTime { get; set; }
    public UserDTO User { get; set; }
    public List<TagDTO> Tags { get; set; }
    public List<CommentDTO> Comments{ get; set; }
}