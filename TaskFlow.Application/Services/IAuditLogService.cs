using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Services.Interfaces
{
	public interface IAuditLogService
	{
		Task<List<AuditLog>> GetRecentLogsAsync();
	}
}