using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using Dingdong_Pay.Areas.Master.Models;
using Dingdong_Pay.Models;

namespace Dingdong_Pay.Areas.Master.Controllers
{
    public class UserController : Controller
    {
        Security ph = new Security();
        List<string> modelErrors = new List<string>();
        bool error = false;

        // GET: Master/User
        public ActionResult Index()
        {
            return View("User");
        }
        public ActionResult GetUserList()
        {
            List<mUser> data = new List<mUser>();
            DataTableHelper TypeHelper = new DataTableHelper();

            int start = Convert.ToInt32(Request["start"]);
            int length = Convert.ToInt32(Request["length"]);
            string searchValue = Request["search[value]"];
            string sortColumnName = Request["columns[" + Request["order[0][column]"] + "][data]"];
            string sortDirection = Request["order[0][dir]"];

            string Username = Request["Username"];
            string FirstName = Request["FirstName"];
            string LastName = Request["LastName"];
            string Email = Request["Email"];
            string Position = Request["Position"];
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
                            cmdSql.CommandText = "SELECT * FROM [mUsers] " +
                                                " WHERE (ISNULL(Username, '') LIKE  '%" + Username + "%' OR '" + Username + "' = '')" +
                                                " AND (ISNULL(FirstName,'') LIKE '%" + FirstName + "%' OR '" + FirstName + "' = '')" +
                                                " AND (ISNULL(LastName,'') LIKE '%" + LastName + "%' OR '" + LastName + "' = '')" +
                                                " AND (ISNULL(Email,'') LIKE '%" + Email + "%' OR '" + Email + "' = '')" +
                                                " AND (ISNULL(Position,'') LIKE '%" + Position + "%' OR '" + Position + "' = '')" +
                                                " AND ISNULL(isDeleted,0) = 0";
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    data.Add(new mUser
                                    {
                                        ID = Convert.ToInt32(sdr["ID"]),
                                        Username = sdr["Username"].ToString(),
                                        Password = ph.base64Decode(sdr["Password"].ToString()),
                                        FirstName = sdr["FirstName"].ToString(),
                                        LastName = sdr["LastName"].ToString(),
                                        MiddleName = sdr["MiddleName"].ToString(),
                                        Email = sdr["Email"].ToString(),
                                        Role = sdr["Role"].ToString(),
                                        UpdateDate = Convert.ToDateTime(sdr["UpdateDate"])
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
            int totalrows = data.Count;

            int totalrowsafterfiltering = data.Count;
            if (sortDirection == "asc")
                data = data.OrderBy(x => TypeHelper.GetPropertyValue(x, sortColumnName)).ToList();

            if (sortDirection == "desc")
                data = data.OrderByDescending(x => TypeHelper.GetPropertyValue(x, sortColumnName)).ToList();

            List<ExcelColumns> PrintData = (from x in data.ToList()
                                            select new ExcelColumns()
                                            {
                                                A = x.Username,
                                                B = x.FirstName,
                                                C = x.LastName,
                                                D = x.MiddleName,
                                                E = x.Email,
                                            }).ToList<ExcelColumns>();

            PrintData.Insert(0, new ExcelColumns()
            {
                A = "Username",
                B = "First Name",
                C = "Last Name",
                D = "Middle Name",
                E = "Email",
            });
            Session["PrintData"] = PrintData;
            Session["PrintCol"] = 5;

            data = data.Skip(start).Take(length).ToList<mUser>();

            return Json(new { data = data, draw = Request["draw"], recordsTotal = totalrows, recordsFiltered = totalrowsafterfiltering }, JsonRequestBehavior.AllowGet);

        }
        public ActionResult DeleteUser(string ID)
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
                            cmdSql.CommandText = "User_Delete";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", ID);
                            cmdSql.Parameters.AddWithValue("@UpdateID", Session["Username"].ToString());

                            SqlParameter Error = cmdSql.Parameters.Add("@Error", SqlDbType.Bit);
                            SqlParameter ErrorMessage = cmdSql.Parameters.Add("@ErrorMessage", SqlDbType.NVarChar, 1000);

                            Error.Direction = ParameterDirection.Output;
                            ErrorMessage.Direction = ParameterDirection.Output;

                            cmdSql.ExecuteNonQuery();

                            error = Convert.ToBoolean(Error.Value);
                            if (error)
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
        public ActionResult GetUserAccess(string ID)
        {
            ArrayList userMenuList = new ArrayList();
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
                            cmdSql.CommandText = "UserPageAccess_GetAccessList";
                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@ID", ID);
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    //var userid = Session["UserID"].ToString();
                                    userMenuList.Add(new
                                    {
                                        ID = sdr["ID"].ToString(),
                                        GroupLabel = sdr["GroupLabel"].ToString(),
                                        PageName = sdr["PageName"].ToString(),
                                        PageLabel = sdr["PageLabel"].ToString(),
                                        URL = sdr["URL"].ToString(),
                                        HasSub = Convert.ToInt32(sdr["HasSub"]),
                                        ParentMenu = sdr["ParentMenu"].ToString(),
                                        ParentOrder = Convert.ToInt32(sdr["ParentOrder"]),
                                        Order = Convert.ToInt32(sdr["Order"]),
                                        Icon = sdr["Icon"].ToString(),
                                        Status = sdr["Status"].ToString() == "" ? 0 : Convert.ToInt32(sdr["Status"]),
                                        ReadAndWrite = sdr["ReadAndWrite"].ToString() == "" ? 0 : Convert.ToInt32(sdr["ReadAndWrite"]),
                                        Delete = sdr["Delete"].ToString() == "" ? 0 : Convert.ToInt32(sdr["Delete"])
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

                return Json(new { success = false, errors = errmsg }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = userMenuList }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult SaveUserAccess(List<mUserPageAccess> userAccessList)
        {
            ModelState.Remove("ID");
            if (ModelState.IsValid)
            {
                try
                {
                    using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Dingdong_Pay"].ToString()))
                    {
                        conn.Open();
                        SqlTransaction transaction;
                        transaction = conn.BeginTransaction();
                        try
                        {
                            foreach (mUserPageAccess userAccess in userAccessList)
                            {
                                using (SqlCommand cmdSql = conn.CreateCommand())
                                {
                                    try
                                    {
                                        cmdSql.Connection = conn;
                                        cmdSql.Transaction = transaction;
                                        cmdSql.CommandType = CommandType.StoredProcedure;
                                        cmdSql.CommandText = "UserPageAccess_INSERT_UPDATE";

                                        cmdSql.Parameters.Clear();
                                        cmdSql.Parameters.AddWithValue("@UserID", userAccess.UserID);
                                        cmdSql.Parameters.AddWithValue("@PageID", userAccess.PageID);
                                        cmdSql.Parameters.AddWithValue("@Status", userAccess.Status);
                                        cmdSql.Parameters.AddWithValue("@ReadAndWrite", userAccess.ReadAndWrite);
                                        cmdSql.Parameters.AddWithValue("@Delete", userAccess.Delete);
                                        cmdSql.Parameters.AddWithValue("@CreateID", Session["Username"].ToString());
                                        SqlParameter ErrorMessage = cmdSql.Parameters.Add("@ErrorMessage", SqlDbType.VarChar, 1000);
                                        SqlParameter Error = cmdSql.Parameters.Add("@Error", SqlDbType.Bit);

                                        Error.Direction = ParameterDirection.Output;
                                        ErrorMessage.Direction = ParameterDirection.Output;

                                        cmdSql.ExecuteNonQuery();

                                        error = Convert.ToBoolean(Error.Value);
                                        if (error)
                                        {
                                            modelErrors.Add(ErrorMessage.Value.ToString());
                                        }
                                    }
                                    catch (Exception err)
                                    {
                                        transaction.Rollback();
                                        conn.Close();
                                        throw new InvalidOperationException(err.Message);
                                    }
                                    finally
                                    {
                                        cmdSql.Dispose();
                                    }
                                }
                            }
                            transaction.Commit();
                        }
                        catch (Exception err)
                        {
                            if (err.InnerException != null)
                                modelErrors.Add("An error occured: " + err.InnerException.ToString());
                            else
                                modelErrors.Add("An error occured: " + err.Message.ToString());
                            error = true;
                        }

                        conn.Close();
                    }
                }
                catch (Exception err)
                {
                    if (err.InnerException != null)
                        modelErrors.Add("An error occured: " + err.InnerException.ToString());
                    else
                        modelErrors.Add("An error occured: " + err.Message.ToString());
                    error = true;
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
            if (modelErrors.Count != 0 || error)
                return Json(new { success = false, errors = modelErrors });
            else
                return Json(new { success = true, msg = "User Page Access was successfully saved" });
        }
        public ActionResult Download(string fileName)
        {
            Session["PrintName"] = fileName;
            return File(ExcelData.Download(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", string.Format(fileName + DateTime.Now.ToString("yyMMddhhmmss") + ".xlsx"));
        }
    }
}