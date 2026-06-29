using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs;
using TaskFlow.Application.Services.Interfaces;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Infrastructure.Services;

public class UserService : IUserService
{
	private readonly AppDbContext _context;

	public UserService(AppDbContext context)
	{
		_context = context;
	}

	public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
	{
		return await _context.Users
			.Select(u => new UserResponseDto(u.UserId, u.FullName, u.Email, u.Role, u.CreatedAt))
			.ToListAsync();
	}

	public async Task<UserResponseDto?> UpdateRoleAsync(int userId, string newRole)
	{
		var validRoles = new[] { "Member", "Manager", "Admin" };
		if (!validRoles.Contains(newRole)) return null;

		var user = await _context.Users.FindAsync(userId);
		if (user == null) return null;

		user.Role = newRole;
		await _context.SaveChangesAsync();

		return new UserResponseDto(user.UserId, user.FullName, user.Email, user.Role, user.CreatedAt);
	}
}