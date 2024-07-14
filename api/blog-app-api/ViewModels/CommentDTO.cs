namespace BlogApp_API.ViewModels;

public class CommentDTO
{
    public int Id { get; set; }
    public string Content { get; set; }
    public DateTime dateTime { get; set; }
    public UserDTO User { get; set; }
    public PostDTO Post { get; set; }
}
