using TaskFlow.Application.DTOs;

namespace TaskFlow.Application.Services.Interfaces;

public interface IProjectService
{
	Task<IEnumerable<ProjectResponseDto>> GetAllAsync();
	Task<ProjectResponseDto?> GetByIdAsync(int projectId);
	Task<ProjectResponseDto> CreateAsync(CreateProjectDto dto, int createdByUserId);
	Task<ProjectResponseDto?> UpdateAsync(int projectId, UpdateProjectDto dto);
	Task<bool> DeleteAsync(int projectId);
	Task<object?> GetSummaryAsync(int projectId);
}