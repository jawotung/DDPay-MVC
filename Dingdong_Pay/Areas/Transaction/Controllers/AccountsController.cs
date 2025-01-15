using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dingdong_Pay.Areas.Transaction.Models;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using Dingdong_Pay.Models;

namespace Dingdong_Pay.Areas.Transaction.Controllers
{
    public class AccountsController : Controller
    {
        // GET: Transaction/Accounts
        List<string> modelErrors = new List<string>();
        DataHelper dataHelper = new DataHelper();
        public ActionResult Index()
        {
            return View("Accounts");
        }
    }
}