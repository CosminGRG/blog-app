using System.Security.Claims;
using BlogApp_API.Controllers;
using BlogApp_API.GenericRepository;
using BlogApp_API.Models;
using BlogApp_API.Repositories;
using BlogApp_API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TagController : ControllerBase
{
    private readonly ITagRepository _tagRepo;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TagController(ITagRepository tagRepo, IHttpContextAccessor httpContextAccessor)
    {
        _tagRepo = tagRepo;
        _httpContextAccessor = httpContextAccessor;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<TagDTO>>> GetAll()
    {
        var tags = await _tagRepo.GetAllAsync();

        if (tags == null || !tags.Any())
        {
            return new List<TagDTO>();
        }

        var tagDTOs = new List<TagDTO>();
        foreach (var tag in tags)
        {
            var newTagDTO = new TagDTO { Id = tag.Id, TagName = tag.TagName, };
            tagDTOs.Add(newTagDTO);
        }

        return Ok(tagDTOs ?? new List<TagDTO>());
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<TagDTO>> Get(int id)
    {
        var tag = await _tagRepo.GetByIdAsync(id);
        if (tag is null)
        {
            return NotFound();
        }

        var tagDTO = new TagDTO { Id = tag.Id, TagName = tag.TagName, };

        return Ok(tagDTO);
    }

    [AllowAnonymous]
    [HttpGet("used")]
    public async Task<ActionResult<List<TagDTO>>> GetUsedTags()
    {
        var tags = await _tagRepo.GetTagsWithPostsAsync();
        if (tags is null || !tags.Any())
        {
            return new List<TagDTO>();
        }

        var tagDTOs = new List<TagDTO>();
        foreach (var tag in tags)
        {
            var newTagDTO = new TagDTO { Id = tag.Id, TagName = tag.TagName, };
            tagDTOs.Add(newTagDTO);
        }

        return Ok(tagDTOs ?? new List<TagDTO>());
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] TagDTO tagModel)
    {
        if (tagModel == null || string.IsNullOrEmpty(tagModel.TagName))
        {
            return BadRequest("Tag name cannot be empty.");
        }

        var tag = new Tag { TagName = tagModel.TagName, };

        await _tagRepo.InsertAsync(tag);
        await _tagRepo.SaveAsync();

        return CreatedAtAction(nameof(Get), new { id = tag.Id }, tag);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var tag = await _tagRepo.GetByIdAsync(id);

        if (tag is null)
        {
            return NotFound();
        }

        await _tagRepo.DeleteAsync(id);
        await _tagRepo.SaveAsync();

        return NoContent();
    }
}
