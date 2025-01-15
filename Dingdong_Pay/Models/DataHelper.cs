using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
namespace Dingdong_Pay.Models
{
    public class DataHelper
    {
        public string GetData(string field, string table, string condition, string asVar = "",string query ="")
        {
            string retVal = "";
            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Dingdong_Pay"].ConnectionString.ToString()))
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        try
                        {
                            cmdSql.CommandTimeout = 0;
                            cmdSql.CommandType = CommandType.Text;
                            if (query == "")
                                cmdSql.CommandText = "SELECT " + field + " AS text FROM " + table + " WHERE " + condition;
                            else
                                cmdSql.CommandText = query;
                            using (SqlDataReader rdSql = cmdSql.ExecuteReader())
                            {
                                if (rdSql.Read())
                                {
                                    retVal = rdSql["text"].ToString();
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
                }
            }
            catch (Exception err)
            {
                string errmsg;
                if (err.InnerException != null)
                    errmsg = "An error occured: " + err.InnerException.ToString();
                else
                    errmsg = "An error occured: " + err.ToString();
            }
            return retVal;
        }
        public static string GetPurposeVal(string GroupCode, string Code)
        {
            string value = "";
            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["Sakuban_Management"].ConnectionString.ToString()))
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        try
                        {
                            cmdSql.CommandType = CommandType.Text;
                            cmdSql.CommandText = "SELECT Value1 FROM Purpose WHERE GroupCode = '" + GroupCode + "' And Code = '" + Code + "'";
                            using (SqlDataReader rdSql = cmdSql.ExecuteReader())
                            {
                                if (rdSql.Read())
                                {
                                    value = rdSql["Value1"].ToString();
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
                }
            }
            catch (Exception err)
            {
                string errmsg;
                if (err.InnerException != null)
                    errmsg = "An error occured: " + err.InnerException.ToString();
                else
                    errmsg = "An error occured: " + err.ToString();
            }
            return value;
        }
        public static string ConvertToDateTimeString(string value)
        {
            try
            {
                value = value == null ? "" : Convert.ToDateTime(value).ToString("yyyy/MM/dd");
                value = value == "1900/01/01" ? "" : value;
            }
            catch (Exception err)
            {
                string errmsg;
                if (err.InnerException != null)
                    errmsg = "An error occured: " + err.InnerException.ToString();
                else
                    errmsg = "An error occured: " + err.ToString();
            }
            return value;
        }
        public static string ConvertToString(string value)
        {
            try
            {
                value = value == null ? "" : value;
            }
            catch (Exception err)
            {
                string errmsg;
                if (err.InnerException != null)
                    errmsg = "An error occured: " + err.InnerException.ToString();
                else
                    errmsg = "An error occured: " + err.ToString();
            }
            return value;
        }
        public static string StringToNumber(string value)
        {
            try
            {
                value = value == null ? "" : value.Replace(",", "").Replace("%", "");
            }
            catch (Exception err)
            {
                string errmsg;
                if (err.InnerException != null)
                    errmsg = "An error occured: " + err.InnerException.ToString();
                else
                    errmsg = "An error occured: " + err.ToString();
            }
            return value;
        }
    }
}
