using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Mvc;
using Dingdong_Pay.Models;
using Dingdong_Pay.Areas.Master.Models;
using System.Net.Mail;
using System.Net;
using System.IO;

namespace Dingdong_Pay.Controllers
{
    [AllowAnonymous]
    public class LoginController : Controller
    {
        Security ph = new Security();
        List<string> modelErrors = new List<string>();
        DataHelper helper = new DataHelper();
        string errmsg;

        // GET: Login
        public ActionResult Index()
        {
            if (Session["ID"] != null)
            {
                return RedirectToAction("Index", "Home", new { area = "" });
            }
            else
            {
                return View("Login");
            }
        }
        public ActionResult CreateUser()
        {
            if (Session["ID"] != null)
            {
                return RedirectToAction("Index", "Home", new { area = "" });
            }
            else
            {
                return View("CreateUser");
            }
        }
        public ActionResult ForgotPassword()
        {
            if (Session["ID"] != null)
            {
                return RedirectToAction("Index", "Home", new { area = "" });
            }
            else
            {
                return View("ForgotPassword");
            }
        }
        [HttpPost]
        public ActionResult SessionForgotPassword(string ForgotPassword)
        {
            try
            {
                Random generator = new Random();
                string ID = helper.GetData("TOP 1 ID", "mUsers", "(Email = '" + ForgotPassword + "' OR MobileNo = '" + ForgotPassword + "')");
                if (ID == "")
                {

                    return Json(new { success = false, errmsg = "Email/MobileNo not existing", data = new { error = false } });
                }
                else
                {
                    Session["OnloadOTP"] = 1;
                    Session["ForgotPassword"] = ForgotPassword;
                    Session["ForgotPasswordID"] = ID;
                    Session["OTP"] = generator.Next(0, 1000000).ToString("D6");
                    SendOTP();
                    return Json(new { success = true, data = new { error = false } });
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
        public void SendOTP()
        {
            try
            {
                string EmailTo = Session["ForgotPassword"].ToString();
                MailMessage mail = new MailMessage();

                string EmailCredentials = ConfigurationManager.ConnectionStrings["EmailCredentials"].ConnectionString.ToString();
                string[] emaildetails = EmailCredentials.Split(';');
                mail.From = new MailAddress(emaildetails[2]);
                mail.To.Add(EmailTo);

                SmtpClient client = new SmtpClient();
                client.UseDefaultCredentials = false;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.Host = emaildetails[0];
                client.Port = Convert.ToInt32(emaildetails[1]);
                client.Credentials = new NetworkCredential(emaildetails[2], emaildetails[3]);
                client.EnableSsl = true;

                mail.Subject = "Dingdong Pay Forgot Passwor OTP";
                string msg = "<p>Good day. <br/>" +
                             " OTP System generated: " + Session["OTP"] + "</p>";
                String vhtml = String.Empty;
                StreamReader reader = new StreamReader(Server.MapPath("/Template/Email/email.html"));
                vhtml = reader.ReadToEnd();
                vhtml = vhtml.Replace("{{{body}}}", msg);
                mail.IsBodyHtml = true;
                mail.Body = vhtml;
                client.Send(mail);
            }
            catch (Exception err)
            {
                throw new InvalidOperationException(err.Message);
            }
        }
        public ActionResult OTTP()
        {
            if (Session["ID"] != null)
            {
                return RedirectToAction("Index", "Home", new { area = "" });
            }
            else
            {
                if(Session["OnloadOTP"] != null)
                {
                    Session["OnloadOTP"] = null;
                    return View("OTTP");
                }
                else
                {
                    Session["ForgotPassword"] = null;
                    Session["ForgotPasswordID"] = null;
                    Session["OTP"] = null;
                    return RedirectToAction("ForgotPassword", "Login", new { area = "" });
                }
                
            }
        }
        public ActionResult ResendOTP()
        {
            try
            {
                Random generator = new Random();
                Session["OTP"] = generator.Next(0, 1000000).ToString("D6");
                SendOTP();
                return Json(new { success = true, data = new { error = false } });

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
        public ActionResult ValidateOTTP(string OTP)
        {
            try
            {
                if(Session["OTP"].ToString() == OTP)
                {
                    return Json(new { success = true, data = new { error = false } });
                }
                else
                {
                    return Json(new { success = false, errmsg = "Please enter the correct code and try again", data = new { error = false } });
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
        public ActionResult ResetPassword()
        {
            if (Session["ID"] != null)
            {
                return RedirectToAction("Index", "Home", new { area = "" });
            }
            else if (Session["ForgotPasswordID"] == null)
            {
                return RedirectToAction("Index", "Login", new { area = "" });
            }
            else
            {
                return View("ResetPassword");
            }
        }
        public ActionResult SavePassword(string Password)
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
                            Password = ph.base64Encode(Password).ToString();
                            cmdSql.CommandType = CommandType.StoredProcedure;
                            cmdSql.CommandText = "User_ResetPassword";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", Session["ForgotPasswordID"].ToString());
                            cmdSql.Parameters.AddWithValue("@Password", Password);

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
            Session["ForgotPassword"] = null;
            Session["ForgotPasswordID"] = null;
            Session["OTP"] = null;
            return Json(new { success = true, data = new { error = false, msg = "Your password has been changed." } });

        }
        public ActionResult PasswordSuccess()
        {
            if (Session["ID"] != null)
            {
                return RedirectToAction("Index", "Home", new { area = "" });
            }
            else
            {
                return View("PasswordSuccess");
            }
        }
        public ActionResult LoginEntry(Login data)
        {
            try
            {
                Security ph = new Security();
                string password = ph.base64Encode(data.Password.ToString());

                DataHelper dataHelper = new DataHelper();

                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Dingdong_Pay"].ConnectionString.ToString()))
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        cmdSql.CommandType = CommandType.StoredProcedure;
                        cmdSql.CommandText = "User_Login";

                        cmdSql.Parameters.Clear();
                        cmdSql.Parameters.AddWithValue("@Username", data.Username);
                        cmdSql.Parameters.AddWithValue("@Password", password);

                        using (SqlDataReader rdSql = cmdSql.ExecuteReader())
                        {
                            if (rdSql.Read())
                            {
                                Session["ID"] = Convert.ToInt32(rdSql["ID"]);
                                Session["Username"] = rdSql["Username"].ToString();
                                Session["FirstName"] = rdSql["FirstName"].ToString();
                                Session["LastName"] = rdSql["LastName"].ToString();
                                Session["FullName"] = rdSql["FirstName"].ToString() + " " + rdSql["LastName"].ToString();
                            }
                            else
                            {
                                errmsg = "Invalid Username or Password. Please try again.";
                            }
                        }
                    }
                }
            }
            catch (Exception err)
            {
                if (err.InnerException != null)
                    errmsg = "Error: " + err.InnerException.ToString();
                else
                    errmsg = "Error: " + err.Message.ToString();
            }
            if (errmsg != null)
                return Json(new { success = true, data = new { error = true, errmsg = errmsg } });
            else
            {
                return Json(new { success = true, data = new { error = false } });
            }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Logout()
        {
            Session.Abandon();
            return RedirectToAction("Index", "Login", new { area = "" });
        }
        public ActionResult SessionError()
        {
            return Json(new { success = false, type = "Login", errors = "Session has expired. Please login again. Thank you." }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult SaveUser(mUser User)
        {
            ModelState.Remove("ID");
            if (ModelState.IsValid)
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
                                User.Password = String.IsNullOrEmpty(User.Password) ? "" : ph.base64Encode(User.Password).ToString();
                                cmdSql.CommandType = CommandType.StoredProcedure;
                                cmdSql.CommandText = "User_InsertUpdate";
                                cmdSql.Parameters.Clear();
                                cmdSql.Parameters.AddWithValue("@ID", String.IsNullOrEmpty(User.Status) ? User.ID : Convert.ToInt32(Session["ID"]));
                                cmdSql.Parameters.AddWithValue("@Username", User.Username);
                                cmdSql.Parameters.AddWithValue("@Password", User.Password);
                                cmdSql.Parameters.AddWithValue("@FirstName", User.FirstName);
                                cmdSql.Parameters.AddWithValue("@LastName", User.LastName);
                                cmdSql.Parameters.AddWithValue("@MiddleName", User.MiddleName);
                                cmdSql.Parameters.AddWithValue("@Email", User.Email);
                                cmdSql.Parameters.AddWithValue("@MobileNo", User.MobileNo);
                                cmdSql.Parameters.AddWithValue("@BirthDay", User.BirthDay);
                                cmdSql.Parameters.AddWithValue("@Status", User.Status);
                                cmdSql.Parameters.AddWithValue("@Role", "User");
                                SqlParameter ErrorMessage = cmdSql.Parameters.Add("@ErrorMessage", SqlDbType.VarChar, 1000);
                                SqlParameter Error = cmdSql.Parameters.Add("@Error", SqlDbType.Bit);

                                Error.Direction = ParameterDirection.Output;
                                ErrorMessage.Direction = ParameterDirection.Output;

                                cmdSql.ExecuteNonQuery();

                                if (Convert.ToBoolean(Error.Value))
                                {
                                    string[] Errors = ErrorMessage.Value.ToString().Split(',');
                                    for (int i = 0; i < Errors.Length; i++)
                                    {
                                        if(Errors[i] != "")
                                            modelErrors.Add(Errors[i]);
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
            }
            else
            {
                foreach (var modelStateKey in ViewData.ModelState.Keys)
                {
                    var modelStateVal = ViewData.ModelState[modelStateKey];
                    foreach (var error in modelStateVal.Errors)
                    {
                        var key = modelStateKey;
                        var errMessage = error.ErrorMessage;
                        var exception = error.Exception;
                        modelErrors.Add(errMessage);
                    }
                }
            }
            return Json(new { success = true, data = new { Error = modelErrors, msg = "User was successfully registered.Please login your account" } });
        }
    }
}
