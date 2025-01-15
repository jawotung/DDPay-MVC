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
        public ActionResult GetBudgetList()
        {
            List<mBudget> data = new List<mBudget>();
            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Dingdong_Pay"].ConnectionString.ToString()))
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        try
                        {
                            cmdSql.CommandType = CommandType.StoredProcedure;
                            cmdSql.CommandText = "Budget_GetList";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@CreateID", Session["ID"].ToString());
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    data.Add(new mBudget
                                    {
                                        ID = Convert.ToInt32(sdr["ID"]),
                                        Amount = sdr["Amount"].ToString(),
                                        Spend = sdr["Spend"].ToString(),
                                        StartDate = Convert.ToDateTime(sdr["StartDate"].ToString()).ToString("MMMM yyyy"),
                                        EndDate = Convert.ToDateTime(sdr["EndDate"].ToString()).ToString("MMMM yyyy"),
                                        Repeatbudget = Convert.ToInt32(sdr["Repeatbudget"]),
                                        BreakdownYear = Convert.ToInt32(sdr["BreakdownYear"].ToString()),
                                        Breakdown = sdr["Breakdown"].ToString() == "" ? 0 : Convert.ToInt32(sdr["Breakdown"].ToString()),
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
        public ActionResult GetExpenseList()
        {
            List<mExpense> data = new List<mExpense>();
            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Dingdong_Pay"].ConnectionString.ToString()))
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        try
                        {
                            cmdSql.CommandType = CommandType.StoredProcedure;
                            cmdSql.CommandText = "BudgetExpense_GetList";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@CreateID", Session["ID"].ToString());
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    data.Add(new mExpense
                                    {
                                        ID = Convert.ToInt32(sdr["ID"]),
                                        ExpenseTypeID = Convert.ToInt32(sdr["ExpenseTypeID"]),
                                        ExpenseType = sdr["ExpenseType"].ToString(),
                                        ExpenseAmount = sdr["ExpenseAmount"].ToString(),
                                        SpendAmount = sdr["SpendAmount"].ToString(),
                                        isAllBudget = Convert.ToInt32(sdr["isAllBudget"].ToString()),
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
        public ActionResult SaveBudget(mBudget data)
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
                            cmdSql.Parameters.AddWithValue("@Amount", data.Amount.Replace(",", ""));
                            cmdSql.Parameters.AddWithValue("@StartDate", data.StartDate);
                            cmdSql.Parameters.AddWithValue("@EndDate", data.EndDate);
                            cmdSql.Parameters.AddWithValue("@Repeatbudget", data.Repeatbudget);
                            cmdSql.Parameters.AddWithValue("@BreakdownYear", data.BreakdownYear);
                            cmdSql.Parameters.AddWithValue("@Breakdown", data.Breakdown);
                            cmdSql.Parameters.AddWithValue("@CreateID", Session["ID"].ToString());
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
        public ActionResult SaveExpense(mExpense data)
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
                            cmdSql.CommandText = "BudgetExpense_InsertUpdate";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", data.ID);
                            cmdSql.Parameters.AddWithValue("@ExpenseType", data.ExpenseType);
                            cmdSql.Parameters.AddWithValue("@ExpenseAmount", data.ExpenseAmount.Replace(",", ""));
                            cmdSql.Parameters.AddWithValue("@isAllBudget", data.isAllBudget);
                            cmdSql.Parameters.AddWithValue("@CreateID", Session["ID"].ToString());
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