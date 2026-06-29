namespace TaskFlow.Application.DTOs;

public record WeeklyTaskDto(
	string Day,
	int Count
);

public record DashboardSummaryDto(
	int TotalProjects,
	int TotalTasks,
	int CompletedTasks,
	int TodoTasks,
	int InProgressTasks,
	int DoneTasks,
	List<WeeklyTaskDto> WeeklyTasks
);