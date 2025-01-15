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
using Dingdong_Pay.Areas.Master.Models;

namespace Dingdong_Pay.Areas.Other.Controllers
{
    public class AccountController : Controller
    {
        // GET: Other/Account
        List<string> modelErrors = new List<string>();
        public ActionResult Index()
        {
            return View("Account");
        }
        public ActionResult GetUser()
        {
            mUser data = new mUser();
            Security ph = new Security();
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
                            cmdSql.CommandText = "SELECT * FROM [mUsers] WHERE ID = " + Session["ID"].ToString();
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                if(sdr.Read())
                                {
                                    data.ID = Convert.ToInt32(sdr["ID"]);
                                    data.Username = sdr["Username"].ToString();
                                    data.Password = ph.base64Decode(sdr["Password"].ToString());
                                    data.FirstName = sdr["FirstName"].ToString();
                                    data.LastName = sdr["LastName"].ToString();
                                    data.MiddleName = sdr["MiddleName"].ToString();
                                    data.Email = sdr["Email"].ToString();
                                    data.BirthDay = Convert.ToDateTime(sdr["BirthDay"]).ToString("MM/dd/yyyy");
                                    data.MobileNo = sdr["MobileNo"].ToString();
                                    data.Role = sdr["Role"].ToString();
                                    data.UpdateDate = Convert.ToDateTime(sdr["UpdateDate"]);
                                    data.FullName = sdr["FirstName"].ToString() + " " + sdr["MiddleName"].ToString() + " " + sdr["LastName"].ToString();
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
                            cmdSql.CommandType = CommandType.StoredProcedure;
                            cmdSql.CommandText = "Account_GetList";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@CreateID", Session["ID"].ToString());
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
                                        TypesName = sdr["TypesName"].ToString(),
                                        BankName = sdr["BankName"].ToString(),
                                        AccountNumber = sdr["AccountNumber"].ToString(),
                                        ExpirationDate = sdr["ExpirationDate"].ToString(),
                                        CVCCVV = sdr["CVCCVV"].ToString(),
                                        CreateDate = sdr["CreateDate"].ToString(),
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
        public ActionResult GetTransactionList(string iAccount)
        {
            List<mCommon> data = new List<mCommon>();
            int Account = String.IsNullOrEmpty(iAccount) ? 0 : Convert.ToInt32(iAccount);
            if (Account != 0)
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

            return Json(new { success = true, data = data}, JsonRequestBehavior.AllowGet);
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
                            cmdSql.Parameters.AddWithValue("@AccountNumber", data.AccountNumber);
                            cmdSql.Parameters.AddWithValue("@ExpirationDate", data.ExpirationDate);
                            cmdSql.Parameters.AddWithValue("@CVCCVV", data.CVCCVV);
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
                return Json(new { success = true, msg = "Account was successfully saved" });
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
            return Json(new { success = true, msg = "Account was successfully deleted." });

        }
    }
}