using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskFlow.Application.DTOs;
using TaskFlow.Application.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using TaskFlow.API.Hubs;

namespace TaskFlow.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
	private readonly ITaskService _taskService;
	private readonly IHubContext<NotificationHub> _hubContext;

	public TasksController(
		ITaskService taskService,
		IHubContext<NotificationHub> hubContext)
	{
		_taskService = taskService;
		_hubContext = hubContext;
	}

	

	[HttpGet]
	public async Task<IActionResult> GetAll()
	{
		var tasks = await _taskService.GetAllAsync();
		return Ok(tasks);
	}

	[HttpGet("project/{projectId}")]
	public async Task<IActionResult> GetByProject(int projectId)
	{
		var tasks = await _taskService.GetByProjectAsync(projectId);
		return Ok(tasks);
	}

	[HttpGet("{id}")]
	public async Task<IActionResult> GetById(int id)
	{
		var task = await _taskService.GetByIdAsync(id);
		if (task == null) return NotFound();
		return Ok(task);
	}

	[HttpPost]
	public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
	{
		var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		var task = await _taskService.CreateAsync(dto, userId);
		await _hubContext.Clients.All.SendAsync(
	"ReceiveNotification",
	"📋 New Task Created",
	task.Title
);
		Console.WriteLine("✅ Notification Sent");
		return CreatedAtAction(nameof(GetById), new { id = task.TaskId }, task);
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
	{
		var task = await _taskService.UpdateAsync(id, dto);
		if (task == null) return NotFound();
		return Ok(task);
	}

	[HttpPut("{id}/status")]
	public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTaskStatusDto dto)
	{
		var task = await _taskService.UpdateStatusAsync(id, dto.Status);
		if (task == null) return NotFound();
		return Ok(task);
	}

	[HttpDelete("{id}")]
	[Authorize(Roles = "Admin,Manager")]
	public async Task<IActionResult> Delete(int id)
	{
		var success = await _taskService.DeleteAsync(id);
		if (!success) return NotFound();
		return NoContent();
	}
}