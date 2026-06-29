namespace TaskFlow.Application.DTOs;

public record CreateProjectDto(string Name, string? Description);

public record UpdateProjectDto(string Name, string? Description, bool IsArchived);

public record ProjectResponseDto(
	int ProjectId,
	string Name,
	string? Description,
	string CreatedByName,
	DateTime CreatedAt,
	bool IsArchived,
	int TotalTasks,
	int CompletedTasks
);