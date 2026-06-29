using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace TaskFlow.API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	public class AttachmentsController : ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly IWebHostEnvironment _environment;

		public AttachmentsController(
			AppDbContext context,
			IWebHostEnvironment environment)
		{
			_context = context;
			_environment = environment;
		}

		[HttpPost("upload/{taskId}")]
		public async Task<IActionResult> Upload(
	int taskId,
	IFormFile file)
		{
			if (file == null || file.Length == 0)
			{
				return BadRequest("No file selected.");
			}

			var task = await _context.Tasks.FindAsync(taskId);

			if (task == null)
			{
				return NotFound("Task not found.");
			}

			var webRoot = _environment.WebRootPath;

			if (string.IsNullOrEmpty(webRoot))
			{
				webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
			}

			var uploadsFolder = Path.Combine(webRoot, "uploads");

			if (!Directory.Exists(uploadsFolder))
			{
				Directory.CreateDirectory(uploadsFolder);
			}

			var storedFileName =
				$"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

			var filePath = Path.Combine(
				uploadsFolder,
				storedFileName);

			using (var stream = new FileStream(filePath, FileMode.Create))
			{
				await file.CopyToAsync(stream);
			}

			var attachment = new Attachment
			{
				TaskId = taskId,
				FileName = file.FileName,
				StoredFileName = storedFileName,
				ContentType = file.ContentType,
				FileSize = file.Length,
				FilePath = filePath,
				UploadedAt = DateTime.UtcNow
			};

			_context.Attachments.Add(attachment);

			await _context.SaveChangesAsync();

			return Ok(new
			{
				attachment.AttachmentId,
				attachment.TaskId,
				attachment.FileName,
				attachment.StoredFileName,
				attachment.ContentType,
				attachment.FileSize,
				attachment.UploadedAt
			});
		}

		[HttpGet("task/{taskId}")]
		public async Task<IActionResult> GetByTask(int taskId)
		{
			var attachments = await _context.Attachments
				.Where(a => a.TaskId == taskId)
				.Select(a => new
				{
					a.AttachmentId,
					a.FileName,
					a.ContentType,
					a.FileSize,
					a.UploadedAt
				})
				.ToListAsync();

			return Ok(attachments);
		}

		[HttpGet("download/{attachmentId}")]
		public async Task<IActionResult> Download(int attachmentId)
		{
			var attachment = await _context.Attachments
				.FirstOrDefaultAsync(a => a.AttachmentId == attachmentId);

			if (attachment == null)
			{
				return NotFound("Attachment not found.");
			}

			if (!System.IO.File.Exists(attachment.FilePath))
			{
				return NotFound("File not found on server.");
			}

			var bytes = await System.IO.File.ReadAllBytesAsync(attachment.FilePath);

			return File(
				bytes,
				attachment.ContentType,
				attachment.FileName);
		}

		[HttpDelete("{attachmentId}")]
		public async Task<IActionResult> Delete(int attachmentId)
		{
			var attachment = await _context.Attachments
				.FirstOrDefaultAsync(a => a.AttachmentId == attachmentId);

			if (attachment == null)
			{
				return NotFound("Attachment not found.");
			}

			if (System.IO.File.Exists(attachment.FilePath))
			{
				System.IO.File.Delete(attachment.FilePath);
			}

			_context.Attachments.Remove(attachment);

			await _context.SaveChangesAsync();

			return Ok(new
			{
				message = "Attachment deleted successfully."
			});
		}
	}
}