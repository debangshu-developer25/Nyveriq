using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Application.DTOs;
using TaskFlow.Application.Services.Interfaces;

namespace TaskFlow.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
	private readonly IUserService _userService;

	public UsersController(IUserService userService)
	{
		_userService = userService;
	}

	[HttpGet]
	public async Task<IActionResult> GetAll()
	{
		var users = await _userService.GetAllAsync();
		return Ok(users);
	}

	[HttpPut("{id}/role")]
	public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateUserRoleDto dto)
	{
		var user = await _userService.UpdateRoleAsync(id, dto.Role);
		if (user == null) return BadRequest("Invalid role or user not found.");
		return Ok(user);
	}
}