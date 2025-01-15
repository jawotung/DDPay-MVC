using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dingdong_Pay.Areas.Other.Controllers
{
    public class SettingsController : Controller
    {
        // GET: Other/Settings
        public ActionResult Index()
        {
            return View("Settings");
        }
    }
}