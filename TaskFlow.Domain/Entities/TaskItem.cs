using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace TaskFlow.Domain.Entities
{
	public class TaskItem
	{
		public int TaskId { get; set; }
		public int ProjectId { get; set; }
		public string Title { get; set; } = string.Empty;
		public string? Description { get; set; }
		public int? AssignedTo { get; set; }
		public int CreatedBy { get; set; }
		public string Status { get; set; } = "Todo";
		public string Priority { get; set; } = "Medium";
		public DateTime? DueDate { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public Project? Project { get; set; }
		public User? AssignedUser { get; set; }
		public ICollection<Comment> Comments { get; set; } = new List<Comment>();
		public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
	}
}
