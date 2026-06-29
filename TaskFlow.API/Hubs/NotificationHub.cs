using Microsoft.AspNetCore.SignalR;

namespace TaskFlow.API.Hubs
{
	public class NotificationHub : Hub
	{
		public override async Task OnConnectedAsync()
		{
			Console.WriteLine($"✅ Connected: {Context.ConnectionId}");
			await base.OnConnectedAsync();
		}

		public override async Task OnDisconnectedAsync(Exception? exception)
		{
			Console.WriteLine($"❌ Disconnected: {Context.ConnectionId}");
			await base.OnDisconnectedAsync(exception);
		}

		public async Task Ping()
		{
			Console.WriteLine("📩 Ping received from React");
		}
	}
}