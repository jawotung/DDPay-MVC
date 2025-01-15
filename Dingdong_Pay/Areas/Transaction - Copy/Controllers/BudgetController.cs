using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dingdong_Pay.Areas.Transaction.Models;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net.Http;

namespace Dingdong_Pay.Areas.Transaction.Controllers
{
    public class BudgetController : Controller
    {
        // GET: Transaction/Budget
        List<string> modelErrors = new List<string>();
        public ActionResult Index()
        {
            return View("Budget");
        }
        public ActionResult GetMonthlyList(string Year)
        {
            List<mCommon> data = new List<mCommon>();
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
                            cmdSql.CommandText = "SELECT * FROM [vBudget_GetMonthly] " +
                                                " WHERE Year = '" + Year + "'";
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    data.Add(new mCommon
                                    {
                                        ID = Convert.ToInt32(sdr["ID"]),
                                        Year = sdr["Year"].ToString(),
                                        Month = sdr["Month"].ToString(),
                                        ExpensesAmount = sdr["ExpensesAmount"].ToString(),
                                        Remaining = sdr["Remaining"].ToString(),
                                        Percentage = Convert.ToDouble(sdr["Percentage"].ToString()),
                                        TotalAmount = sdr["TotalAmount"].ToString(),
                                        InputDate = Convert.ToDateTime(sdr["InputDate"]).ToString("MMMM yyyy"),
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
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Dingdong_Pay"].ConnectionString.ToString()))
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        try
                        {
                            cmdSql.CommandType = CommandType.Text;
                            cmdSql.CommandText = "SELECT * FROM [vBudget_GetMonthly] " +
                                                " WHERE Year = '" + Year + "'";
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    data.Add(new mCommon
                                    {
                                        ID = Convert.ToInt32(sdr["ID"]),
                                        Year = sdr["Year"].ToString(),
                                        Month = sdr["Month"].ToString(),
                                        ExpensesAmount = sdr["ExpensesAmount"].ToString(),
                                        Remaining = sdr["Remaining"].ToString(),
                                        Percentage = Convert.ToDouble(sdr["Percentage"].ToString()),
                                        TotalAmount = sdr["TotalAmount"].ToString(),
                                        InputDate = Convert.ToDateTime(sdr["InputDate"]).ToString("MMMM yyyy"),
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
        public ActionResult GetCategoryList(string Year, string Month)
        {
            List<mCommon> data = new List<mCommon>();
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
                            cmdSql.CommandText = "SELECT * FROM [vBudget_GetCategory] " +
                                                " WHERE Year = '" + Year + "'" +
                                                " AND Month = '" + Month + "'";
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    data.Add(new mCommon
                                    {
                                        ID = Convert.ToInt32(sdr["ID"]),
                                        Expenses = sdr["Expenses"].ToString(),
                                        ExpensesName = sdr["ExpensesName"].ToString(),
                                        Year = sdr["Year"].ToString(),
                                        Month = sdr["Month"].ToString(),
                                        ExpensesAmount = sdr["ExpensesAmount"].ToString(),
                                        Remaining = sdr["Remaining"].ToString(),
                                        Percentage = Convert.ToDouble(sdr["Percentage"].ToString()),
                                        TotalAmount = sdr["TotalAmount"].ToString(),
                                        InputDate = Convert.ToDateTime(sdr["InputDate"]).ToString("MMMM yyyy"),
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
        public ActionResult SaveData(mBudget data)
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
                            cmdSql.CommandText = "Budget_InsertUpdate";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", data.ID);
                            cmdSql.Parameters.AddWithValue("@Expenses", data.Expenses);
                            cmdSql.Parameters.AddWithValue("@ExpensesChild", data.ExpensesChild);
                            cmdSql.Parameters.AddWithValue("@InputDate", Convert.ToDateTime(data.InputDate));
                            cmdSql.Parameters.AddWithValue("@Status", data.Status == "on" ? 1 : 0);
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
                            cmdSql.CommandText = "Budget_Delete";
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