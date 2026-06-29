using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Domain.Entities
{
	public class User
	{
		public int UserId { get; set; }
		public string FullName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string PasswordHash { get; set; } = string.Empty;
		public string Role { get; set; } = "Member";
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();
		public ICollection<Comment> Comments { get; set; } = new List<Comment>();
	}
}
