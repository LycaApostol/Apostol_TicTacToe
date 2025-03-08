using Microsoft.EntityFrameworkCore;

namespace TicTacToe_Apostol.Models
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }

    }

}
