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
        public ActionResult GetAccountList()
        {
            List<mAccount> data = new List<mAccount>();
            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Dingdong_Pay"].ConnectionString.ToString()))
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        try
                        {
                            cmdSql.CommandType = CommandType.Text;
                            cmdSql.CommandText = "SELECT * FROM [vAccount_Accounts] ";
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    data.Add(new mAccount
                                    {
                                        ID = Convert.ToInt32(sdr["ID"].ToString()),
                                        Types = sdr["Types"].ToString(),
                                        Bank = sdr["Bank"].ToString(),
                                        Account = sdr["Account"].ToString(),
                                        Currency = sdr["Currency"].ToString(),
                                        Amount = sdr["Amount"].ToString(),
                                        TypesName = sdr["TypesName"].ToString(),
                                        BankName = sdr["BankName"].ToString(),
                                        CurrencyName = sdr["CurrencyName"].ToString(),
                                        Payment = sdr["Payment"].ToString(),
                                        DisplayName = sdr["DisplayName"].ToString(),
                                    });
                                }
                            }
                        }
                        catch (Exception err)
                        {
                            throw new InvalidOperationException(err.Message);
                        }
                        finally
                        {
                            cmdSql.Dispose();
                            conn.Close();
                        }
                    }
                    conn.Close();
                }
            }
            catch (Exception err)
            {
                string errmsg;
                if (err.InnerException != null)
                    errmsg = "An error occured: " + err.InnerException.ToString();
                else
                    errmsg = "An error occured: " + err.Message.ToString();

                return Json(new { success = false, msg = errmsg }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = true, data = data }, JsonRequestBehavior.AllowGet);

        }
        public ActionResult GetTransactionList()
        {
            List<mCommon> data = new List<mCommon>();
            DataTableHelper TypeHelper = new DataTableHelper();

            int start = Convert.ToInt32(Request["start"]);
            int length = Convert.ToInt32(Request["length"]);
            string searchValue = Request["search[value]"];
            string sortColumnName = Request["columns[" + Request["order[0][column]"] + "][data]"];
            string sortDirection = Request["order[0][dir]"];
            int Account = Request["Account"] == "" ? 0 : Convert.ToInt32(Request["Account"]);
            if(Account != 0)
            {
                try
                {
                    using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Dingdong_Pay"].ConnectionString.ToString()))
                    {
                        conn.Open();
                        using (SqlCommand cmdSql = conn.CreateCommand())
                        {
                            try
                            {
                                cmdSql.CommandType = CommandType.Text;
                                cmdSql.CommandText = "SELECT * FROM vAccount_Transaction WHERE Account = " + Account;
                                using (SqlDataReader sdr = cmdSql.ExecuteReader())
                                {
                                    while (sdr.Read())
                                    {
                                        data.Add(new mCommon
                                        {
                                            Expenses = sdr["Expenses"].ToString(),
                                            ExpensesName = sdr["ExpensesName"].ToString(),
                                            InputDate = Convert.ToDateTime(sdr["InputDate"]).ToString("MMMM dd, yyyy"),
                                            FullDate = Convert.ToDateTime(sdr["InputDate"]).ToString("yyyyMMdd"),
                                            Transaction = sdr["Transaction"].ToString(),
                                            TotalAmount = sdr["Amount"].ToString(),
                                        });
                                    }

                                }
                            }
                            catch (Exception err)
                            {
                                throw new InvalidOperationException(err.Message);
                            }
                            finally
                            {
                                cmdSql.Dispose();
                                conn.Close();
                            }
                        }
                        conn.Close();
                    }
                }
                catch (Exception err)
                {
                    string errmsg;
                    if (err.InnerException != null)
                        errmsg = "An error occured: " + err.InnerException.ToString();
                    else
                        errmsg = "An error occured: " + err.ToString();

                    return Json(new { success = false, msg = errmsg }, JsonRequestBehavior.AllowGet);
                }
            }

            int totalrows = data.Count;
            if (!string.IsNullOrEmpty(searchValue))//filter
                data = data.Where(x =>
                    x.Transaction.ToString().ToLower().Contains(searchValue.ToLower()) ||
                    x.TotalAmount.ToString().ToLower().Contains(searchValue.ToLower()) ||
                    x.ExpensesName.ToString().ToLower().Contains(searchValue.ToLower()) ||
                    x.InputDate.ToString().ToLower().Contains(searchValue.ToLower())
                ).ToList<mCommon>();

            int totalrowsafterfiltering = data.Count;
            if (sortDirection == "asc")
                data = data.OrderBy(x => TypeHelper.GetPropertyValue(x, sortColumnName)).ToList();

            if (sortDirection == "desc")
                data = data.OrderByDescending(x => TypeHelper.GetPropertyValue(x, sortColumnName)).ToList();

            data = data.Skip(start).Take(length).ToList<mCommon>();


            return Json(new { data = data, draw = Request["draw"], recordsTotal = totalrows, recordsFiltered = totalrowsafterfiltering }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult SaveData(mAccount data)
        {
            using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Dingdong_Pay"].ToString()))
            {
                try
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        try
                        {
                            cmdSql.CommandType = CommandType.StoredProcedure;
                            cmdSql.CommandText = "Account_InsertUpdate";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", data.ID);
                            cmdSql.Parameters.AddWithValue("@Types", data.Types);
                            cmdSql.Parameters.AddWithValue("@Bank", data.Bank);
                            cmdSql.Parameters.AddWithValue("@Account", data.Account);
                            cmdSql.Parameters.AddWithValue("@Currency", data.Currency);
                            cmdSql.Parameters.AddWithValue("@Amount", data.Amount.Replace(",", ""));
                            cmdSql.Parameters.AddWithValue("@CreateID", Session["Username"].ToString());
                            SqlParameter ErrorMessage = cmdSql.Parameters.Add("@ErrorMessage", SqlDbType.VarChar, 1000);
                            SqlParameter Error = cmdSql.Parameters.Add("@Error", SqlDbType.Bit);

                            Error.Direction = ParameterDirection.Output;
                            ErrorMessage.Direction = ParameterDirection.Output;

                            cmdSql.ExecuteNonQuery();

                            if (Convert.ToBoolean(Error.Value))
                                modelErrors.Add(ErrorMessage.Value.ToString());

                        }
                        catch (Exception err)
                        {
                            throw new InvalidOperationException(err.Message);
                        }
                        finally
                        {
                            cmdSql.Dispose();
                            conn.Close();
                        }
                    }
                    conn.Close();
                }
                catch (Exception err)
                {
                    conn.Close();
                    string errmsg;
                    if (err.InnerException != null)
                        errmsg = "Error: " + err.InnerException.ToString();
                    else
                        errmsg = "Error: " + err.Message.ToString();

                    return Json(new { success = false, errors = errmsg }, JsonRequestBehavior.AllowGet);
                }
            }
            if (modelErrors.Count != 0)
                return Json(new { success = false, errors = modelErrors });
            else
            {
                return Json(new { success = true, msg = "Data was successfully saved" });
            }
        }
        public ActionResult DeleteData(string ID)
        {
            using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Dingdong_Pay"].ConnectionString.ToString()))
            {
                try
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        try
                        {
                            cmdSql.CommandType = CommandType.StoredProcedure;
                            cmdSql.CommandText = "Account_Delete";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", ID);
                            cmdSql.Parameters.AddWithValue("@UpdateID", Session["Username"].ToString());

                            SqlParameter Error = cmdSql.Parameters.Add("@Error", SqlDbType.Bit);
                            SqlParameter ErrorMessage = cmdSql.Parameters.Add("@ErrorMessage", SqlDbType.NVarChar, 1000);

                            Error.Direction = ParameterDirection.Output;
                            ErrorMessage.Direction = ParameterDirection.Output;

                            cmdSql.ExecuteNonQuery();
                            if (Convert.ToBoolean(Error.Value))
                            {
                                cmdSql.Dispose();
                                conn.Close();
                                return Json(new { success = false, errors = ErrorMessage.Value.ToString() }, JsonRequestBehavior.AllowGet);
                            }
                        }
                        catch (Exception err)
                        {
                            throw new InvalidOperationException(err.Message);
                        }
                        finally
                        {
                            cmdSql.Dispose();
                            conn.Close();
                        }
                    }
                    conn.Close();
                }
                catch (Exception err)
                {
                    conn.Close();
                    string errmsg;
                    if (err.InnerException != null)
                        errmsg = "Error: " + err.InnerException.ToString();
                    else
                        errmsg = "Error: " + err.Message.ToString();

                    return Json(new { success = false, errors = errmsg }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { success = true, msg = "User was successfully deleted." });

        }
    }
}