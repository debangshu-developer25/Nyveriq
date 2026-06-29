using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskFlow.Application.DTOs;
using TaskFlow.Application.Services.Interfaces;

namespace TaskFlow.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
	private readonly IProjectService _projectService;

	public ProjectsController(IProjectService projectService)
	{
		_projectService = projectService;
	}

	[HttpGet]
	public async Task<IActionResult> GetAll()
	{
		var projects = await _projectService.GetAllAsync();
		return Ok(projects);
	}

	[HttpGet("{id}")]
	public async Task<IActionResult> GetById(int id)
	{
		var project = await _projectService.GetByIdAsync(id);
		if (project == null) return NotFound();
		return Ok(project);
	}

	[HttpGet("{id}/summary")]
	public async Task<IActionResult> GetSummary(int id)
	{
		var summary = await _projectService.GetSummaryAsync(id);
		if (summary == null) return NotFound();
		return Ok(summary);
	}

	[HttpPost]
	public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
	{
		var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
		var project = await _projectService.CreateAsync(dto, userId);
		return CreatedAtAction(nameof(GetById), new { id = project.ProjectId }, project);
	}

	[HttpPut("{id}")]
	[Authorize(Roles = "Admin,Manager")]
	public async Task<IActionResult> Update(int id, [FromBody] UpdateProjectDto dto)
	{
		var project = await _projectService.UpdateAsync(id, dto);
		if (project == null) return NotFound();
		return Ok(project);
	}

	[HttpDelete("{id}")]
	[Authorize(Roles = "Admin")]
	public async Task<IActionResult> Delete(int id)
	{
		var success = await _projectService.DeleteAsync(id);
		if (!success) return NotFound();
		return NoContent();
	}
}