using Microsoft.AspNetCore.Mvc;
using TicTacToe_Apostol.Models;


namespace TicTacToe_Apostol.Controllers
{
    public class HomeController : Controller
    {
       

        public IActionResult Index()
        {
           
            return View();
        }

        [HttpPost]
        public IActionResult UpdateScore(string result)
        {
            
            return RedirectToAction("Index");
        }
    }
}
