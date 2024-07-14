namespace BlogApp_API.ViewModels;

public class UpdatePostDTO
{
    public string Title { get; set; }
    public string Content { get; set; }
    public string PostImgPath { get; set; }
    public List<TagDTO> Tags { get; set; }
}
