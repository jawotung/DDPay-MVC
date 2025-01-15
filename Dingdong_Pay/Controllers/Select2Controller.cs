using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Dingdong_Pay.Controllers
{
    public class Select2Controller : Controller
    {
        [AllowAnonymous]
        public ActionResult GetSelect2Data()
        {
            ArrayList results = new ArrayList();
            string val = Request.QueryString["q"];
            string id = Request.QueryString["id"];
            string text = Request.QueryString["text"];
            string table = Request.QueryString["table"];
            string db = Request.QueryString["db"];
            string condition = Request.QueryString["condition"] == null ? "" : Request.QueryString["condition"];
            string isDistict = Request.QueryString["isDistict"] == null ? "" : Request.QueryString["isDistict"];
            string display = Request.QueryString["display"];
            string addOptionVal = Request.QueryString["addOptionVal"];
            string addOptionText = Request.QueryString["addOptionText"];
            string query = Request.QueryString["query"];
            string orderBy = Request.QueryString["orderBy"] == null ? "" : Request.QueryString["orderBy"];

            if ((addOptionVal != null && display == "id&text") && (val == null || val == ""))
                results.Add(new { id = addOptionVal, text = addOptionText });

            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings[db].ConnectionString.ToString()))

                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {

                        if (query == null || query == "")
                        {

                            #region
                            cmdSql.CommandType = CommandType.Text;
                            if (isDistict != "")
                            {
                                cmdSql.CommandText = "SELECT DISTINCT(" + id + ")  AS id," + text + "  as text FROM " + table + " WHERE IsDeleted=0 " + condition + " AND ( " + id + " like '%" + val + "%' OR " + text + " like '%" + val + "%') ORDER BY text";
                                using (SqlDataReader sdr = cmdSql.ExecuteReader())
                                {
                                    while (sdr.Read())
                                    {
                                        if (display == "id&text")
                                            results.Add(new { id = sdr["id"].ToString(), text = sdr["text"].ToString() });
                                        if (display == "id&id-text")
                                            results.Add(new { id = sdr["id"].ToString(), text = sdr["id"].ToString() + "-" + sdr["text"].ToString() });
                                    }

                                }
                            }
                            else
                            {
                                cmdSql.CommandText = "SELECT " + id + " AS id," + text + " as text FROM " + table + " WHERE IsDeleted=0 " + condition + " AND ( " + id + " like '%" + val + "%' OR " + text + " like '%" + val + "%') ORDER BY text";
                                using (SqlDataReader sdr = cmdSql.ExecuteReader())
                                {
                                    while (sdr.Read())
                                    {
                                        if (display == "id&text")
                                            results.Add(new { id = sdr["id"].ToString(), text = sdr["text"].ToString() });
                                        if (display == "id&id-text")
                                            results.Add(new { id = sdr["id"].ToString(), text = sdr["id"].ToString() + "-" + sdr["text"].ToString() });
                                    }

                                }
                            }
                            #endregion
                        }
                        else
                        {
                            #region
                            cmdSql.CommandType = CommandType.Text;
                            cmdSql.CommandText = query;
                            using (SqlDataReader sdr = cmdSql.ExecuteReader())
                            {
                                while (sdr.Read())
                                {
                                    if (display == "id&text")
                                        results.Add(new { id = sdr[id].ToString(), text = sdr[text].ToString() });
                                    if (display == "id&id-text")
                                        results.Add(new { id = sdr[id].ToString(), text = sdr[id].ToString() + "-" + sdr[text].ToString() });
                                }

                            }
                            #endregion
                        }
                    }
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
            return Json(new { results }, JsonRequestBehavior.AllowGet);
        }
        [AllowAnonymous]
        public ActionResult GetSelect2SP()
        {
            List<Select2Data> results = new List<Select2Data>();
            string val = Request.QueryString["q"];
            string sp = Request.QueryString["sp"];
            string db = Request.QueryString["db"];
            string display = Request.QueryString["display"];

            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings[db].ConnectionString.ToString()))
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        cmdSql.CommandType = CommandType.StoredProcedure;
                        cmdSql.CommandText = sp;
                        cmdSql.Parameters.Clear();
                        cmdSql.ExecuteNonQuery();
                        using (SqlDataReader sdr = cmdSql.ExecuteReader())
                        {
                            while (sdr.Read())
                            {
                                results.Add(new Select2Data
                                {
                                    ID = sdr["ID"].ToString(),
                                    text = sdr["text"].ToString(),
                                });
                            }
                        }
                    }
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
            if (!string.IsNullOrEmpty(val))//filter
                results = results.Where(x =>x.text.ToLower().Contains(val.ToLower())).ToList<Select2Data>();

            return Json(new { results }, JsonRequestBehavior.AllowGet);
        }
    }

    public class Select2Data
    {
        public string ID { get; set; }
        public string text { get; set; }
    }

}
