using TaskFlow.Application.DTOs;

namespace TaskFlow.Application.Services.Interfaces;

public interface IAuthService
{
	Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
	Task<AuthResponseDto?> LoginAsync(LoginDto dto);
}