namespace TaskFlow.Application.DTOs;

public record UserResponseDto(int UserId, string FullName, string Email, string Role, DateTime CreatedAt);

public record UpdateUserRoleDto(string Role);