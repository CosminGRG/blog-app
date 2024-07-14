using System.Security.Claims;
using BlogApp_API.Controllers;
using BlogApp_API.GenericRepository;
using BlogApp_API.Models;
using BlogApp_API.Repositories;
using BlogApp_API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace BlogApp_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly IPostRepository _postRepo;
    private readonly IUserRepository _userRepo;
    private readonly ITagRepository _tagRepo;
    private readonly ICommentRepository _commRepo;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PostController(
        IPostRepository postRepo,
        IUserRepository userRepo,
        ITagRepository tagRepo,
        ICommentRepository commRepo,
        IHttpContextAccessor httpContextAccessor
    )
    {
        _postRepo = postRepo;
        _userRepo = userRepo;
        _tagRepo = tagRepo;
        _commRepo = commRepo;
        _httpContextAccessor = httpContextAccessor;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<PostDTO>>> GetAll()
    {
        var posts = await _postRepo.GetAllAsync(["User", "Comments", "Tags"]);
        if (posts is null || !posts.Any())
        {
            return Ok(new List<PostDTO>());
        }

        var postDTOs = new List<PostDTO>();
        foreach (var post in posts)
        {
            var newPostDTO = ConstructPostDTO(post);
            postDTOs.Add(newPostDTO);
        }

        return Ok(postDTOs ?? new List<PostDTO>());
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<PostDTO>> Get(int id)
    {
        var post = await _postRepo.GetPostByIdAsync(id, ["User", "Comments", "Tags"]);
        if (post == null)
        {
            return NotFound();
        }

        var postDTO = ConstructPostDTO(post);

        return Ok(postDTO);
    }

    [AllowAnonymous]
    [HttpGet("tag/{tagName}")]
    public async Task<ActionResult<List<PostDTO>>> GetPostsByTag(string tagName)
    {
        var posts = await _postRepo.GetPostsByTagAsync(tagName);
        if (posts is null)
        {
            return NotFound();
        }

        var postDTOs = new List<PostDTO>();
        foreach (var post in posts)
        {
            var newPostDTO = ConstructPostDTO(post);
            postDTOs.Add(newPostDTO);
        }

        return Ok(postDTOs);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("img")]
    public async Task<IActionResult> UploadImg(IFormFile file)
    {
        var uploads = Path.Combine("wwwroot", "images");
        var filePath = Path.Combine(uploads, file.FileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok($"/images/{file.FileName}");
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePostDTO postModel)
    {
        var currentUser = await GetCurrentUser();

        if (currentUser is null)
        {
            return StatusCode(
                500,
                "An error occurred while processing your request. Please try again later."
            );
        }

        var tags = await _tagRepo.GetByIdsAsync(postModel.TagIds);

        var post = new Post
        {
            Title = postModel.Title,
            Content = postModel.Content,
            PostImgPath = postModel.PostImgPath,
            insDateTime = DateTime.UtcNow,
            updDateTime = DateTime.UtcNow,
            Tags = tags,
            User = currentUser
        };

        await _postRepo.InsertAsync(post);
        await _postRepo.SaveAsync();

        return CreatedAtAction(nameof(Get), new { id = post.Id }, post);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdatePostDTO postModel)
    {
        var existingPost = await _postRepo.GetPostByIdAsync(id, ["Tags"]);
        if (existingPost is null)
        {
            return NotFound();
        }

        existingPost.Title = postModel.Title;
        existingPost.Content = postModel.Content;

        if (!string.IsNullOrEmpty(postModel.PostImgPath))
        {
            existingPost.PostImgPath = postModel.PostImgPath;
        }

        var existingTags = existingPost.Tags.ToList();
        foreach (var newTag in postModel.Tags)
        {
            var tag = existingTags.FirstOrDefault(t => t.Id == newTag.Id);
            if (tag is null)
            {
                existingPost.Tags.Add(new Tag { Id = newTag.Id, TagName = newTag.TagName });
            }
        }

        foreach (var tag in existingTags)
        {
            if (!postModel.Tags.Any(t => t.TagName == tag.TagName))
            {
                existingPost.Tags.Remove(tag);
            }
        }

        existingPost.updDateTime = DateTime.UtcNow;

        await _postRepo.UpdateAsync(existingPost);

        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var post = await _postRepo.GetByIdAsync(id);

        if (post is null)
        {
            return NotFound();
        }

        try
        {
            var postComments = await _commRepo.GetCommentsAssociatedWithPost(id);
            if (postComments != null)
            {
                foreach (var comment in postComments)
                {
                    await _commRepo.DeleteAsync(comment.Id);
                }
                await _commRepo.SaveAsync();
            }

            await _postRepo.DeleteAsync(id);
            await _postRepo.SaveAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error deleting post: {ex.Message}");
        }
    }

    private PostDTO ConstructPostDTO(Post post)
    {
        var postDTO = new PostDTO
        {
            Id = post.Id,
            Title = post.Title,
            Content = post.Content,
            PostImgPath = post.PostImgPath,
            InsDateTime = post.insDateTime,
            UpdDateTime = post.updDateTime,
            User =
                post.User != null
                    ? new UserDTO { Username = post.User.Username, Email = post.User.Email }
                    : null,
            Tags = post
                .Tags.Select(tag => new TagDTO { Id = tag.Id, TagName = tag.TagName })
                .ToList(),
            Comments = post
                .Comments.Select(comment => new CommentDTO
                {
                    Content = comment.Content,
                    dateTime = comment.dateTime,
                    User =
                        comment.User != null
                            ? new UserDTO
                            {
                                Username = comment.User.Username,
                                Email = comment.User.Email
                            }
                            : null,
                })
                .ToList(),
        };

        return postDTO;
    }

    private async Task<User?> GetCurrentUser()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext != null)
        {
            var userEmailClaim = httpContext.User.FindFirst(ClaimTypes.Email);
            if (userEmailClaim != null)
            {
                var email = userEmailClaim.Value;
                return await _userRepo.GetUserByEmailAsync(email);
            }
        }

        return null;
    }
}
