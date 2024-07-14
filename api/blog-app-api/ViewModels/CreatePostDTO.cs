
namespace BlogApp_API.ViewModels;

public class CreatePostDTO
{
    public string Title { get; set; }
    public string Content { get; set; }
    public string PostImgPath {get; set; }
    public List<int> TagIds { get; set; }
}