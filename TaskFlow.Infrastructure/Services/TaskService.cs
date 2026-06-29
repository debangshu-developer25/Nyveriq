using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs;
using TaskFlow.Application.Services.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services;

public class TaskService : ITaskService
{
	private readonly AppDbContext _context;

	public TaskService(AppDbContext context)
	{
		_context = context;
	}

	public async Task<IEnumerable<TaskResponseDto>> GetByProjectAsync(int projectId)
	{
		return await _context.Tasks
			.Where(t => t.ProjectId == projectId)
			.Include(t => t.AssignedUser)
			.Select(t => new TaskResponseDto(
				t.TaskId, t.ProjectId, t.Title, t.Description,
				t.Status, t.Priority, t.DueDate, t.AssignedTo,
				t.AssignedUser != null ? t.AssignedUser.FullName : null,
				t.CreatedAt))
			.ToListAsync();
	}

	public async Task<TaskResponseDto?> GetByIdAsync(int taskId)
	{
		var t = await _context.Tasks
			.Include(x => x.AssignedUser)
			.FirstOrDefaultAsync(x => x.TaskId == taskId);

		if (t == null) return null;

		return new TaskResponseDto(
			t.TaskId, t.ProjectId, t.Title, t.Description,
			t.Status, t.Priority, t.DueDate, t.AssignedTo,
			t.AssignedUser?.FullName, t.CreatedAt);
	}

	public async Task<TaskResponseDto> CreateAsync(CreateTaskDto dto, int createdByUserId)
	{
		var task = new TaskItem
		{
			ProjectId = dto.ProjectId,
			Title = dto.Title,
			Description = dto.Description,
			AssignedTo = dto.AssignedTo,
			CreatedBy = createdByUserId,
			Priority = dto.Priority,
			DueDate = dto.DueDate,
			Status = "Todo"
		};

		_context.Tasks.Add(task);
		await _context.SaveChangesAsync();

		// Log to AuditLogs
		_context.AuditLogs.Add(new AuditLog
		{
			UserId = createdByUserId,
			Action = "Created Task",
			EntityName = "Task",
			EntityId = task.TaskId,
			OldValue = null,
			NewValue = task.Title
		});
		await _context.SaveChangesAsync();

		return new TaskResponseDto(
			task.TaskId, task.ProjectId, task.Title, task.Description,
			task.Status, task.Priority, task.DueDate, task.AssignedTo, null, task.CreatedAt);
	}

	public async Task<TaskResponseDto?> UpdateAsync(int taskId, UpdateTaskDto dto)
	{
		var task = await _context.Tasks.FindAsync(taskId);
		if (task == null) return null;

		task.Title = dto.Title;
		task.Description = dto.Description;
		task.AssignedTo = dto.AssignedTo;
		task.Priority = dto.Priority;
		task.DueDate = dto.DueDate;

		await _context.SaveChangesAsync();

		return await GetByIdAsync(taskId);
	}

	public async Task<TaskResponseDto?> UpdateStatusAsync(int taskId, string status)
	{
		var task = await _context.Tasks.FindAsync(taskId);
		if (task == null) return null;

		var oldStatus = task.Status;
		task.Status = status;
		await _context.SaveChangesAsync();

		// Log to AuditLogs
		_context.AuditLogs.Add(new AuditLog
		{
			UserId = task.CreatedBy,
			Action = "Changed Status",
			EntityName = "Task",
			EntityId = task.TaskId,
			OldValue = oldStatus,
			NewValue = status
		});
		await _context.SaveChangesAsync();

		return await GetByIdAsync(taskId);
	}

	public async Task<bool> DeleteAsync(int taskId)
	{
		var task = await _context.Tasks.FindAsync(taskId);
		if (task == null) return false;

		_context.Tasks.Remove(task);
		await _context.SaveChangesAsync();
		return true;
	}

	public async Task<IEnumerable<TaskResponseDto>> GetAllAsync()
	{
		return await _context.Tasks
			.Include(t => t.AssignedUser)
			.Select(t => new TaskResponseDto(
				t.TaskId,
				t.ProjectId,
				t.Title,
				t.Description,
				t.Status,
				t.Priority,
				t.DueDate,
				t.AssignedTo,
				t.AssignedUser != null ? t.AssignedUser.FullName : null,
				t.CreatedAt
			))
			.ToListAsync();
	}
}