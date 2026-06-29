using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.DTOs;
using TaskFlow.Application.Services.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace TaskFlow.Infrastructure.Services;

public class AuthService : IAuthService
{
	private readonly AppDbContext _context;
	private readonly IConfiguration _config;

	public AuthService(AppDbContext context, IConfiguration config)
	{
		_context = context;
		_config = config;
	}

	public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
	{
		var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
		if (existingUser != null) return null; // Email already exists

		var user = new User
		{
			FullName = dto.FullName,
			Email = dto.Email,
			PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
			Role = "Member" // All new signups start as Member; Admin promotes later
		};

		_context.Users.Add(user);
		await _context.SaveChangesAsync();

		var token = GenerateToken(user);
		return new AuthResponseDto(token, user.FullName, user.Role);
	}

	public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
	{
		var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
		if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
			return null; // Invalid credentials

		var token = GenerateToken(user);
		return new AuthResponseDto(token, user.FullName, user.Role);
	}

	private string GenerateToken(User user)
	{
		var claims = new[]
		{
			new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
			new Claim(ClaimTypes.Email, user.Email),
			new Claim(ClaimTypes.Name, user.FullName),
			new Claim(ClaimTypes.Role, user.Role)
		};

		var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
		var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

		var token = new JwtSecurityToken(
			issuer: _config["Jwt:Issuer"],
			audience: _config["Jwt:Audience"],
			claims: claims,
			expires: DateTime.UtcNow.AddHours(8),
			signingCredentials: creds
		);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}
}