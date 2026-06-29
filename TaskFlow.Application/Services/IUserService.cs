using TaskFlow.Application.DTOs;

namespace TaskFlow.Application.Services.Interfaces;

public interface IUserService
{
	Task<IEnumerable<UserResponseDto>> GetAllAsync();
	Task<UserResponseDto?> UpdateRoleAsync(int userId, string newRole);
}