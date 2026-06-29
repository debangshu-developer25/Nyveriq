namespace TaskFlow.Application.DTOs.Comments
{
	public class CreateCommentDto
	{
		public int TaskId { get; set; }

		public string Content { get; set; } = string.Empty;
	}
}