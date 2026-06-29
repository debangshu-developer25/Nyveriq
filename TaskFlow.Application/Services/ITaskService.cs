using TaskFlow.Application.DTOs;

namespace TaskFlow.Application.Services.Interfaces;

public interface ITaskService
{
	Task<IEnumerable<TaskResponseDto>> GetByProjectAsync(int projectId);
	Task<TaskResponseDto?> GetByIdAsync(int taskId);
	Task<TaskResponseDto> CreateAsync(CreateTaskDto dto, int createdByUserId);
	Task<TaskResponseDto?> UpdateAsync(int taskId, UpdateTaskDto dto);
	Task<TaskResponseDto?> UpdateStatusAsync(int taskId, string status);
	Task<bool> DeleteAsync(int taskId);
	Task<IEnumerable<TaskResponseDto>> GetAllAsync();
}