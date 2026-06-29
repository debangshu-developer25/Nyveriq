namespace TaskFlow.Application.DTOs;

public record CreateTaskDto(
	int ProjectId,
	string Title,
	string? Description,
	int? AssignedTo,
	string Priority,
	DateTime? DueDate
);

public record UpdateTaskStatusDto(string Status);

public record UpdateTaskDto(
	string Title,
	string? Description,
	int? AssignedTo,
	string Priority,
	DateTime? DueDate
);

public record TaskResponseDto(
	int TaskId,
	int ProjectId,
	string Title,
	string? Description,
	string Status,
	string Priority,
	DateTime? DueDate,
	int? AssignedTo,
	string? AssignedUserName,
	DateTime CreatedAt
);