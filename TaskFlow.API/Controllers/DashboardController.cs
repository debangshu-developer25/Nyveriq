using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.Services.Interfaces;

namespace TaskFlow.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
	private readonly IDashboardService _dashboardService;

	public DashboardController(IDashboardService dashboardService)
	{
		_dashboardService = dashboardService;
	}

	[HttpGet("summary")]
	public async Task<IActionResult> GetSummary()
	{
		var data = await _dashboardService.GetSummaryAsync();
		return Ok(data);
	}
}