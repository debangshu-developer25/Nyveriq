using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Domain.Entities
{
	public class AuditLog
	{
		public int LogId { get; set; }
		public int UserId { get; set; }
		public string Action { get; set; } = string.Empty;
		public string EntityName { get; set; } = string.Empty;
		public int EntityId { get; set; }
		public string? OldValue { get; set; }
		public string? NewValue { get; set; }
		public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
	}
}
