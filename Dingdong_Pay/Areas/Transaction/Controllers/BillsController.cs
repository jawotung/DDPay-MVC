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
    public class BillsController : Controller
    {
        // GET: Transaction/Bills
        List<string> modelErrors = new List<string>();
        DataHelper dataHelper = new DataHelper();
        DataHelper helper = new DataHelper();
        public ActionResult Index()
        {
            return View("Bills");
        }
        public ActionResult CountBills()
        {
            try
            {
                int iCount = Convert.ToInt32(helper.GetData("COUNT(*)", "tBills", "CreateID = '" + Session["ID"].ToString() + "' AND isDeleted = 0"));
                if (iCount == 0)
                    return Json(new { success = true, data = false }, JsonRequestBehavior.AllowGet);
                else
                return Json(new { success = true, data = true }, JsonRequestBehavior.AllowGet);
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
        public ActionResult GetBillsList(string iStatus)
        {
            List<mBills> data = new List<mBills>();
            int Status = String.IsNullOrEmpty(iStatus) ? 0 : Convert.ToInt32(iStatus);
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
                            cmdSql.CommandText = "Bills_GetList";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@Status", Status);
                            cmdSql.Parameters.AddWithValue("@CreateID", Session["ID"].ToString());
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                data = sdrBill(sdr);
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

            return Json(new { success = true, data = data}, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetBills(string[] ID)
        {
            List<mBills> data = new List<mBills>();
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
                            cmdSql.CommandText = "Bills_Get";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", string.Join(",", ID));
                            cmdSql.Parameters.AddWithValue("@CreateID", Session["ID"].ToString());
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                data = sdrBill(sdr);
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
            return Json(new { success = true, data});

        }
        public List<mBills> sdrBill(SqlDataReader sdr)
        {
            List<mBills> data = new List<mBills>();
            try
            {
                while (sdr.Read())
                {
                    int DBStatus = 0;
                    string DueMonth = "";

                    if ((String.IsNullOrEmpty(sdr["isPaid"].ToString()) ? 0 : Convert.ToInt32(sdr["isPaid"])) == 1)
                        DBStatus = 2;
                    else if (Convert.ToDateTime(sdr["DueDate"]) <= DateTime.Now)
                        DBStatus = 1;

                    if (Convert.ToInt32(sdr["GroupMonth"]) == -1)
                        DueMonth = "Overdue";
                    else if (Convert.ToInt32(sdr["GroupMonth"]) == 13)
                        DueMonth = "Paid";
                    else
                        DueMonth = Convert.ToDateTime(sdr["DueDate"]).ToString("MMMM");

                    data.Add(new mBills
                    {
                        ID = Convert.ToInt32(sdr["ID"].ToString()),
                        Biller = sdr["Biller"].ToString(),
                        BillTitle = sdr["BillTitle"].ToString(),
                        CAN = sdr["CAN"].ToString(),
                        Amount = sdr["Amount"].ToString(),
                        ExpenseTypeID = sdr["ExpenseTypeID"].ToString(),
                        ExpenseType = sdr["ExpenseType"].ToString(),
                        Purpose = sdr["Purpose"].ToString(),
                        Note = sdr["Note"].ToString(),
                        DueDate = Convert.ToDateTime(sdr["DueDate"]).ToString("MM/dd/yyyy"),
                        DueDateName = Convert.ToDateTime(sdr["DueDate"]).ToString("MMM dd, yyyy"),
                        DueMonth = DueMonth,
                        Frequency = sdr["Frequency"].ToString(),
                        StartDate = String.IsNullOrEmpty(sdr["StartDate"].ToString()) ? "" : Convert.ToDateTime(sdr["StartDate"]).ToString("MM/dd/yyyy"),
                        EndDate = String.IsNullOrEmpty(sdr["EndDate"].ToString()) ? "" : Convert.ToDateTime(sdr["EndDate"]).ToString("MM/dd/yyyy"),
                        ReminderType = sdr["ReminderType"].ToString(),
                        ReminderNo = sdr["ReminderNo"].ToString(),
                        ReminderMode = sdr["ReminderMode"].ToString(),
                        Document = sdr["Document"].ToString(),
                        isPaid = Convert.ToInt32(sdr["isPaid"]),
                        ReminderOptions = Convert.ToInt32(sdr["ReminderOptions"]),
                        RecurringOptions = Convert.ToInt32(sdr["RecurringOptions"]),
                        GroupMonth = Convert.ToInt32(sdr["GroupMonth"]),
                        Status = DBStatus,
                        CreateDate = Convert.ToDateTime(sdr["CreateDate"]).ToString("MM/dd/yyyy HH:mm"),
                        LastPayment = String.IsNullOrEmpty(sdr["LastPayment"].ToString()) ? "" : Convert.ToDateTime(sdr["LastPayment"]).ToString("MM/dd/yyyy"),
                    });
                }
            }
            catch
            {
                throw;
            }

            return data;
        }
        public ActionResult GetBillerList()
        {
            List<mBills> data = new List<mBills>();
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
                            cmdSql.CommandText = "Bills_GetBillerList";
                            cmdSql.Parameters.Clear();
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    data.Add(new mBills
                                    {
                                        Biller = sdr["Biller"].ToString(),
                                        BillTitle = sdr["BillTitle"].ToString(),
                                        CAN = sdr["CAN"].ToString(),
                                        DueDate = Convert.ToDateTime(sdr["DueDate"]).ToString("MM/dd/yyyy"),
                                        DueDateName = Convert.ToDateTime(sdr["DueDate"]).ToString("MMM dd, yyyy"),
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
        public ActionResult SaveData(mBills data)
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
                            cmdSql.CommandText = "Bills_InsertUpdate";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", data.ID);
                            cmdSql.Parameters.AddWithValue("@Biller", data.Biller);
                            cmdSql.Parameters.AddWithValue("@BillTitle", data.BillTitle);
                            cmdSql.Parameters.AddWithValue("@CAN", data.CAN);
                            cmdSql.Parameters.AddWithValue("@Amount", data.Amount.Replace(",", ""));
                            cmdSql.Parameters.AddWithValue("@ExpenseType", data.ExpenseType);
                            cmdSql.Parameters.AddWithValue("@Purpose", data.Purpose);
                            cmdSql.Parameters.AddWithValue("@Note", data.Note);
                            cmdSql.Parameters.AddWithValue("@DueDate", data.DueDate);
                            cmdSql.Parameters.AddWithValue("@Document", Document);
                            cmdSql.Parameters.AddWithValue("@RecurringOptions", data.RecurringOptions);
                            cmdSql.Parameters.AddWithValue("@Frequency", data.Frequency);
                            cmdSql.Parameters.AddWithValue("@StartDate", data.StartDate);
                            cmdSql.Parameters.AddWithValue("@EndDate", data.EndDate);
                            cmdSql.Parameters.AddWithValue("@ReminderType", data.ReminderType);
                            cmdSql.Parameters.AddWithValue("@ReminderOptions", data.ReminderOptions);
                            cmdSql.Parameters.AddWithValue("@ReminderNo", data.ReminderNo);
                            cmdSql.Parameters.AddWithValue("@ReminderMode", data.ReminderMode);
                            
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
                                        UploadFiles(ErrorMessage.Value.ToString(), "Bills/Bills", HttpContext.Request.Files[0]);
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
                            cmdSql.CommandText = "Bills_Delete";
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
        public ActionResult MarkAsPaid(mBills data)
        {
            string PaymentDocument = "";
            if (HttpContext.Request.Files.AllKeys.Any())
            {
                PaymentDocument = String.IsNullOrEmpty(HttpContext.Request.Files[0].FileName) ? "" : HttpContext.Request.Files[0].FileName;
            }
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
                            cmdSql.CommandText = "Bills_MarkAsPaid";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", data.ID);
                            cmdSql.Parameters.AddWithValue("@ReferenceNo", data.ReferenceNo);
                            cmdSql.Parameters.AddWithValue("@PaidDate", data.PaidDate);
                            cmdSql.Parameters.AddWithValue("@PaymentMethod", data.PaymentMethod);
                            cmdSql.Parameters.AddWithValue("@PaymentDocument", PaymentDocument);
                            cmdSql.Parameters.AddWithValue("@UpdateID", Session["ID"].ToString());

                            SqlParameter Error = cmdSql.Parameters.Add("@Error", SqlDbType.Bit);
                            SqlParameter ErrorMessage = cmdSql.Parameters.Add("@ErrorMessage", SqlDbType.NVarChar, 1000);

                            Error.Direction = ParameterDirection.Output;
                            ErrorMessage.Direction = ParameterDirection.Output;

                            cmdSql.ExecuteNonQuery();
                            if (Convert.ToBoolean(Error.Value))
                                modelErrors.Add(ErrorMessage.Value.ToString());
                            else
                                if (HttpContext.Request.Files.AllKeys.Any())
                                    if (String.IsNullOrEmpty(HttpContext.Request.Files[0].FileName))
                                        UploadFiles(ErrorMessage.Value.ToString(), "Bills/PaymentDocument/", HttpContext.Request.Files[0]);
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
                return Json(new { success = true, msg = "Marked Meralco bill as paid" });
            }

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