using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskFlow.Application.DTOs.Comments;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;
using System.Security.Claims;

namespace TaskFlow.API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	public class CommentsController : ControllerBase
	{
		private readonly AppDbContext _context;

		public CommentsController(AppDbContext context)
		{
			_context = context;
		}
		[HttpGet("task/{taskId}")]
		public async Task<IActionResult> GetComments(int taskId)
		{
			var comments = await _context.Comments
				.Include(c => c.User)
				.Where(c => c.TaskId == taskId)
				.OrderByDescending(c => c.CreatedAt)
				.Select(c => new CommentDto
				{
					CommentId = c.CommentId,
					TaskId = c.TaskId,
					UserId = c.UserId,
					UserName = c.User!.FullName,
					Content = c.Content,
					CreatedAt = c.CreatedAt
				})
				.ToListAsync();

			return Ok(comments);
		}

		[HttpPost]
		public async Task<IActionResult> CreateComment(CreateCommentDto dto)
		{
			var userId = int.Parse(
				User.FindFirstValue(ClaimTypes.NameIdentifier)!);

			var user = await _context.Users.FindAsync(userId);

			if (user == null)
				return Unauthorized();

			var task = await _context.Tasks.FindAsync(dto.TaskId);

			if (task == null)
				return NotFound("Task not found.");

			var comment = new Comment
			{
				TaskId = dto.TaskId,
				UserId = userId,
				Content = dto.Content,
				CreatedAt = DateTime.UtcNow
			};

			_context.Comments.Add(comment);

			await _context.SaveChangesAsync();

			return Ok(new CommentDto
			{
				CommentId = comment.CommentId,
				TaskId = comment.TaskId,
				UserId = comment.UserId,
				UserName = user.FullName,
				Content = comment.Content,
				CreatedAt = comment.CreatedAt
			});
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteComment(int id)
		{
			var comment = await _context.Comments.FindAsync(id);

			if (comment == null)
				return NotFound();

			_context.Comments.Remove(comment);

			await _context.SaveChangesAsync();

			return Ok(new
			{
				message = "Comment deleted successfully."
			});
		}
	}
}