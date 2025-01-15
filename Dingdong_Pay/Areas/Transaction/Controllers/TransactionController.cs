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
using System.IO;

namespace Dingdong_Pay.Areas.Transaction.Controllers
{
    public class TransactionController : Controller
    {
        // GET: Transaction/Transaction
        List<string> modelErrors = new List<string>();
        DataHelper dataHelper = new DataHelper();
        DataHelper helper = new DataHelper();
        public ActionResult Index()
        {
            return View("Transaction");
        }
        public ActionResult GetTransactionList()
        {
            List<mTransaction> data = new List<mTransaction>();
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
                            cmdSql.CommandText = "Transaction_GetList";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@CreateID", Session["ID"].ToString());
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    data.Add(new mTransaction
                                    {
                                        ID = Convert.ToInt32(sdr["ID"].ToString()),
                                        Amount = sdr["Amount"].ToString(),
                                        ExpenseTypeID = sdr["ExpenseTypeID"].ToString(),
                                        ExpenseType = sdr["ExpenseType"].ToString(),
                                        Note = sdr["Note"].ToString(),
                                        TransactionDate = Convert.ToDateTime(sdr["TransactionDate"]).ToString("MM/dd/yyyy"),
                                        TransactionDateName = Convert.ToDateTime(sdr["TransactionDate"]).ToString("MMM dd, yyyy"),
                                        Frequency = sdr["Frequency"].ToString(),
                                        StartDate = String.IsNullOrEmpty(sdr["StartDate"].ToString()) ? "" : Convert.ToDateTime(sdr["StartDate"]).ToString("MM/dd/yyyy"),
                                        EndDate = String.IsNullOrEmpty(sdr["EndDate"].ToString()) ? "" : Convert.ToDateTime(sdr["EndDate"]).ToString("MM/dd/yyyy"),
                                        Document = sdr["Document"].ToString(),
                                        RecurringOptions = Convert.ToInt32(sdr["RecurringOptions"]),
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

            return Json(new { success = true, data = data }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult SaveData(mTransaction data)
        {
            string Document = "";
            if (HttpContext.Request.Files.AllKeys.Any())
            {
                Document = String.IsNullOrEmpty(HttpContext.Request.Files[0].FileName) ? "" : HttpContext.Request.Files[0].FileName;
            }
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
                            cmdSql.CommandText = "Transaction_InsertUpdate";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", data.ID);
                            cmdSql.Parameters.AddWithValue("@ExpenseType", data.ExpenseType);
                            cmdSql.Parameters.AddWithValue("@Amount", data.Amount.Replace(",", ""));
                            cmdSql.Parameters.AddWithValue("@Note", data.Note);
                            cmdSql.Parameters.AddWithValue("@Document", Document);
                            cmdSql.Parameters.AddWithValue("@TransactionDate", data.TransactionDate);
                            cmdSql.Parameters.AddWithValue("@RecurringOptions", data.RecurringOptions);
                            cmdSql.Parameters.AddWithValue("@Frequency", data.Frequency);
                            cmdSql.Parameters.AddWithValue("@StartDate", data.StartDate);
                            cmdSql.Parameters.AddWithValue("@EndDate", data.EndDate);

                            cmdSql.Parameters.AddWithValue("@CreateID", Session["ID"].ToString());
                            SqlParameter ErrorMessage = cmdSql.Parameters.Add("@ErrorMessage", SqlDbType.VarChar, 1000);
                            SqlParameter Error = cmdSql.Parameters.Add("@Error", SqlDbType.Bit);

                            Error.Direction = ParameterDirection.Output;
                            ErrorMessage.Direction = ParameterDirection.Output;

                            cmdSql.ExecuteNonQuery();

                            if (Convert.ToBoolean(Error.Value))
                                modelErrors.Add(ErrorMessage.Value.ToString());
                            else
                                if (HttpContext.Request.Files.AllKeys.Any())
                                if (!String.IsNullOrEmpty(HttpContext.Request.Files[0].FileName))
                                    UploadFiles(ErrorMessage.Value.ToString(), "Transaction/Transaction", HttpContext.Request.Files[0]);
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
        public ActionResult DeleteData(string[] ID)
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
                            cmdSql.CommandText = "Transaction_Delete";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", string.Join(",", ID));
                            cmdSql.Parameters.AddWithValue("@UpdateID", Session["ID"].ToString());

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
            return Json(new { success = true, msg = "Deleted 1 items from your bill" });

        }
        public Boolean UploadFiles(string ID, string Module, HttpPostedFileBase Files)
        {
            string filePath = string.Empty;
            try
            {

                string ModulePath = Server.MapPath("~/Areas/Transaction/Files/" + Module + "/");
                if (!Directory.Exists(Server.MapPath("~/Areas/Transaction/Files/")))
                {
                    Directory.CreateDirectory(Server.MapPath("~/Areas/Transaction/Files/"));
                }
                if (!Directory.Exists(ModulePath))
                {
                    Directory.CreateDirectory(ModulePath);
                }
                var UploadedFile = Files;
                filePath = ModulePath + ID + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + Path.GetExtension(UploadedFile.FileName);
                UploadedFile.SaveAs(filePath);
                return true;
            }
            catch (Exception err)
            {
                string errmsg;
                if (err.InnerException != null)
                    errmsg = "Error: " + err.InnerException.ToString();
                else
                    errmsg = "Error: " + err.Message.ToString();

                return false;
            }
        }
    }
}