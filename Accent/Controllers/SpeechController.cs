using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Accent.Controllers
{
    public class SpeechController : Controller
    {
        [HttpPost]
        public ActionResult Pronounce(string text, int accent)
        {
            return Content("This is how you pronounce: " + text);
        }
    }
}