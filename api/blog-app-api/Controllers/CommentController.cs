using System.Drawing;
using System.Runtime.CompilerServices;
using BlogApp_API.Models;
using BlogApp_API.Repositories;
using BlogApp_API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly ICommentRepository _commentRepo;
    private readonly IPostRepository _postRepo;
    private readonly IUserRepository _userRepo;

    public CommentController(
        ICommentRepository commentRepo,
        IPostRepository postRepo,
        IUserRepository userRepo
    )
    {
        _commentRepo = commentRepo;
        _postRepo = postRepo;
        _userRepo = userRepo;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<PostDTO>>> GetAll()
    {
        var comments = await _commentRepo.GetAllAsync();

        if (comments is null || !comments.Any())
        {
            return NotFound();
        }

        return Ok(comments);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<CommentDTO>> Get(int id)
    {
        var comment = await _commentRepo.GetByIdAsync(id);

        if (comment is null)
        {
            return NotFound();
        }

        var commentDTO = new CommentDTO
        {
            Id = id,
            Content = comment.Content,
            dateTime = comment.dateTime,
            User = new UserDTO { Username = comment.User.Username, Email = comment.User.Email, }
        };

        return Ok(commentDTO);
    }

    [AllowAnonymous]
    [HttpGet("post/{postId}")]
    public async Task<ActionResult<List<CommentDTO>>> GetCommentsForPost(
        int postId,
        int pageNumber = 1,
        int pageSize = 10
    )
    {
        var comments = await _commentRepo.GetPartOfPostComments(postId, pageNumber, pageSize);

        if (comments is null || !comments.Any())
        {
            return Ok(new List<CommentDTO>());
        }

        var commentDTOs = new List<CommentDTO>();
        foreach (var comment in comments)
        {
            var newCommentDTO = new CommentDTO
            {
                Id = comment.Id,
                Content = comment.Content,
                dateTime = comment.dateTime,
                User = new UserDTO { Username = comment.User.Username, Email = comment.User.Email, }
            };

            commentDTOs.Add(newCommentDTO);
        }

        return Ok(commentDTOs);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCommentDTO commentModel)
    {
        var post = await _postRepo.GetByIdAsync(commentModel.PostId);
        var user = await _userRepo.GetByIdAsync(commentModel.UserId);

        if (post is null || user is null)
        {
            return BadRequest("Error while creating comment. Try again later");
        }

        var comment = new Comment
        {
            Content = commentModel.Content,
            dateTime = DateTime.Now,
            User = user,
            Post = post,
        };

        await _commentRepo.InsertAsync(comment);
        await _commentRepo.SaveAsync();

        return CreatedAtAction(nameof(Get), new { id = post.Id }, comment);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var comment = await _commentRepo.GetByIdAsync(id);

        if (comment is null)
        {
            return NotFound();
        }

        await _postRepo.DeleteAsync(id);
        await _postRepo.SaveAsync();

        return NoContent();
    }
}
