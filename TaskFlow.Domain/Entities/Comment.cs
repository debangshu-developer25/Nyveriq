using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Domain.Entities
{
	public class Comment
	{
		public int CommentId { get; set; }
		public int TaskId { get; set; }
		public int UserId { get; set; }
		public string Content { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public TaskItem? Task { get; set; }
		public User? User { get; set; }
	}
}
