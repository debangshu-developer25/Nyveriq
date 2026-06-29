using TaskFlow.Application.DTOs;

namespace TaskFlow.Application.Services.Interfaces;

public interface IDashboardService
{
	Task<DashboardSummaryDto> GetSummaryAsync();
}