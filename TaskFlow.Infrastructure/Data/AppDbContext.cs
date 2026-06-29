using Microsoft.EntityFrameworkCore;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Infrastructure.Data;

public class AppDbContext : DbContext
{
	public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

	public DbSet<User> Users => Set<User>();
	public DbSet<Project> Projects => Set<Project>();
	public DbSet<TaskItem> Tasks => Set<TaskItem>();
	public DbSet<Comment> Comments => Set<Comment>();
	public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
	public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
	public DbSet<Attachment> Attachments => Set<Attachment>();


	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{

		modelBuilder.Entity<AuditLog>()
			.HasKey(a => a.LogId);

		modelBuilder.Entity<TaskItem>()
			.HasKey(t => t.TaskId);

		modelBuilder.Entity<TaskItem>()
			.HasOne(t => t.Project)
			.WithMany(p => p.Tasks)
			.HasForeignKey(t => t.ProjectId)
			.OnDelete(DeleteBehavior.Cascade);

		modelBuilder.Entity<TaskItem>()
			.HasOne(t => t.AssignedUser)
			.WithMany(u => u.AssignedTasks)
			.HasForeignKey(t => t.AssignedTo)
			.OnDelete(DeleteBehavior.SetNull);

		modelBuilder.Entity<User>()
			.HasIndex(u => u.Email)
			.IsUnique();
		modelBuilder.Entity<Attachment>()
	.HasOne(a => a.Task)
	.WithMany(t => t.Attachments)
	.HasForeignKey(a => a.TaskId)
	.OnDelete(DeleteBehavior.Cascade);

		modelBuilder.Entity<Comment>()
	.HasOne(c => c.Task)
	.WithMany(t => t.Comments)
	.HasForeignKey(c => c.TaskId)
	.OnDelete(DeleteBehavior.Cascade);

		modelBuilder.Entity<Comment>()
			.HasOne(c => c.User)
			.WithMany(u => u.Comments)
			.HasForeignKey(c => c.UserId)
			.OnDelete(DeleteBehavior.Restrict);
	}
}