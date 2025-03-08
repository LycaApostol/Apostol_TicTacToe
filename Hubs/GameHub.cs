namespace TicTacToe_Apostol.Hubs
{
    using Microsoft.AspNetCore.SignalR;
    using System.Threading.Tasks;

    public class GameHub : Hub
    {
        public async Task MakeMove(int cellIndex, string player)
        {
            await Clients.All.SendAsync("ReceiveMove", cellIndex, player);
        }
    }

}
