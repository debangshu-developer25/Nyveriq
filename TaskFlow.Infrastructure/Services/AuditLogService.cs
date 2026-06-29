using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Services.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services
{
	public class AuditLogService : IAuditLogService
	{
		private readonly AppDbContext _context;

		public AuditLogService(AppDbContext context)
		{
			_context = context;
		}

		public async Task<List<AuditLog>> GetRecentLogsAsync()
		{
			return await _context.AuditLogs
				.OrderByDescending(x => x.ChangedAt)
				.Take(20)
				.ToListAsync();
		}
	}
}