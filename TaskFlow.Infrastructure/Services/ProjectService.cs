using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs;
using TaskFlow.Application.Services.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services;

public class ProjectService : IProjectService
{
	private readonly AppDbContext _context;

	public ProjectService(AppDbContext context)
	{
		_context = context;
	}

	public async Task<IEnumerable<ProjectResponseDto>> GetAllAsync()
	{
		return await _context.Projects
			.Include(p => p.Tasks)
			.Select(p => new ProjectResponseDto(
				p.ProjectId,
				p.Name,
				p.Description,
				_context.Users.Where(u => u.UserId == p.CreatedBy).Select(u => u.FullName).FirstOrDefault() ?? "Unknown",
				p.CreatedAt,
				p.IsArchived,
				p.Tasks.Count,
				p.Tasks.Count(t => t.Status == "Done")
			))
			.ToListAsync();
	}

	public async Task<ProjectResponseDto?> GetByIdAsync(int projectId)
	{
		var p = await _context.Projects
			.Include(x => x.Tasks)
			.FirstOrDefaultAsync(x => x.ProjectId == projectId);

		if (p == null) return null;

		var createdByName = await _context.Users
			.Where(u => u.UserId == p.CreatedBy)
			.Select(u => u.FullName)
			.FirstOrDefaultAsync() ?? "Unknown";

		return new ProjectResponseDto(
			p.ProjectId, p.Name, p.Description, createdByName,
			p.CreatedAt, p.IsArchived, p.Tasks.Count,
			p.Tasks.Count(t => t.Status == "Done"));
	}

	public async Task<ProjectResponseDto> CreateAsync(CreateProjectDto dto, int createdByUserId)
	{
		var project = new Project
		{
			Name = dto.Name,
			Description = dto.Description,
			CreatedBy = createdByUserId,
			IsArchived = false
		};

		_context.Projects.Add(project);
		await _context.SaveChangesAsync();

		// Auto-add creator as a project member
		_context.ProjectMembers.Add(new ProjectMember
		{
			ProjectId = project.ProjectId,
			UserId = createdByUserId
		});
		await _context.SaveChangesAsync();

		var createdByName = await _context.Users
			.Where(u => u.UserId == createdByUserId)
			.Select(u => u.FullName)
			.FirstOrDefaultAsync() ?? "Unknown";

		return new ProjectResponseDto(
			project.ProjectId, project.Name, project.Description,
			createdByName, project.CreatedAt, project.IsArchived, 0, 0);
	}

	public async Task<ProjectResponseDto?> UpdateAsync(int projectId, UpdateProjectDto dto)
	{
		var project = await _context.Projects.FindAsync(projectId);
		if (project == null) return null;

		project.Name = dto.Name;
		project.Description = dto.Description;
		project.IsArchived = dto.IsArchived;

		await _context.SaveChangesAsync();
		return await GetByIdAsync(projectId);
	}

	public async Task<bool> DeleteAsync(int projectId)
	{
		var project = await _context.Projects.FindAsync(projectId);
		if (project == null) return false;

		_context.Projects.Remove(project);
		await _context.SaveChangesAsync();
		return true;
	}

	public async Task<object?> GetSummaryAsync(int projectId)
	{
		// Uses the GetProjectSummary stored procedure you created earlier
		var result = await _context.Database
			.SqlQueryRaw<ProjectSummaryResult>(
				"EXEC GetProjectSummary @ProjectId = {0}", projectId)
			.ToListAsync();

		return result.FirstOrDefault();
	}
}

public class ProjectSummaryResult
{
	public int TotalTasks { get; set; }
	public int CompletedTasks { get; set; }
	public int InProgressTasks { get; set; }
	public int OverdueTasks { get; set; }
}