using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Domain.Entities
{
	public class Project
	{
		public int ProjectId { get; set; }
		public string Name { get; set; } = string.Empty;
		public string? Description { get; set; }
		public int CreatedBy { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public bool IsArchived { get; set; } = false;
		public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
		public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
	}
}
