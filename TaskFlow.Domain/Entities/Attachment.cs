namespace TaskFlow.Domain.Entities
{
	public class Attachment
	{
		public int AttachmentId { get; set; }

		public int TaskId { get; set; }

		public string FileName { get; set; } = string.Empty;

		public string StoredFileName { get; set; } = string.Empty;

		public string ContentType { get; set; } = string.Empty;

		public long FileSize { get; set; }

		public string FilePath { get; set; } = string.Empty;

		public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

		public TaskItem Task { get; set; } = null!;
	}
}