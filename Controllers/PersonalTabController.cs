using System;
using Microsoft.AspNetCore.Mvc;
using PersonalTabMVC.Models;

namespace PersonalTabMVC.Controllers
{
    [Route("personaltab")]
    public class PersonalTabController : Controller
    {
        [Route("")]
        public IActionResult PersonalTab()
        {
          
            return View();
        }
    }
}