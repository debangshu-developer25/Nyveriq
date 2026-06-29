using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs;
using TaskFlow.Application.Services.Interfaces;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services;

public class DashboardService : IDashboardService
{
	private readonly AppDbContext _context;

	public DashboardService(AppDbContext context)
	{
		_context = context;
	}

	public async Task<DashboardSummaryDto> GetSummaryAsync()
	{
		var totalProjects = await _context.Projects.CountAsync();

		var totalTasks = await _context.Tasks.CountAsync();

		var completedTasks = await _context.Tasks
			.CountAsync(t => t.Status == "Done");

		var todoTasks = await _context.Tasks
			.CountAsync(t => t.Status == "Todo");

		var inProgressTasks = await _context.Tasks
			.CountAsync(t => t.Status == "In Progress");

		var doneTasks = await _context.Tasks
			.CountAsync(t => t.Status == "Done");

		var weeklyTasks = await _context.Tasks
			.Where(t => t.CreatedAt >= DateTime.Today.AddDays(-6))
			.GroupBy(t => t.CreatedAt.Date)
			.Select(g => new
			{
				Day = g.Key,
				Count = g.Count()
			})
			.ToListAsync();

		var weeklyData = Enumerable.Range(0, 7)
			.Select(i =>
			{
				var date = DateTime.Today.AddDays(-6 + i);

				var item = weeklyTasks.FirstOrDefault(x => x.Day == date.Date);

				return new WeeklyTaskDto(
					date.ToString("ddd"),
					item?.Count ?? 0
				);
			})
			.ToList();

		return new DashboardSummaryDto(
			totalProjects,
			totalTasks,
			completedTasks,
			todoTasks,
			inProgressTasks,
			doneTasks,
			weeklyData
		);
	}
}