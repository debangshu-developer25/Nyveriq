using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Domain.Entities
{
	public class ProjectMember
	{
		public int ProjectMemberId { get; set; }
		public int ProjectId { get; set; }
		public int UserId { get; set; }
		public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
		public Project? Project { get; set; }
		public User? User { get; set; }
	}
}
