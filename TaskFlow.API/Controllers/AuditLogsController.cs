using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.Services.Interfaces;

namespace TaskFlow.API.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class AuditLogsController : ControllerBase
	{
		private readonly IAuditLogService _auditLogService;

		public AuditLogsController(IAuditLogService auditLogService)
		{
			_auditLogService = auditLogService;
		}

		[HttpGet("recent")]
		public async Task<IActionResult> GetRecent()
		{
			var logs = await _auditLogService.GetRecentLogsAsync();

			return Ok(logs);
		}
	}
}