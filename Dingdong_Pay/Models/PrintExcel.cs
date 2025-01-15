using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OfficeOpenXml;
using System.IO;
using OfficeOpenXml.Style;
using System.Web.Mvc;

namespace Dingdong_Pay.Models
{
    public class ExcelColumns
    {
        public string A { get; set; }
        public string B { get; set; }
        public string C { get; set; }
        public string D { get; set; }
        public string E { get; set; }
        public string F { get; set; }
        public string G { get; set; }
        public string H { get; set; }
        public string I { get; set; }
        public string J { get; set; }
        public string K { get; set; }
        public string L { get; set; }
        public string M { get; set; }
        public string N { get; set; }
        public string O { get; set; }
        public string P { get; set; }
        public string Q { get; set; }
        public string R { get; set; }
        public string S { get; set; }
        public string T { get; set; }
        public string U { get; set; }
        public string V { get; set; }
        public string W { get; set; }
        public string X { get; set; }
        public string Y { get; set; }
    }
    public class ExcelData
    {
        public static byte[] Download(string SheetName1 = "",string FileNamme = "PrintExcel.xlsx")
        {
            try
            {
                string templateFilename = FileNamme;
                string dir = Path.GetTempPath();
                string datetimeToday = DateTime.Now.ToString("yyMMddhhmmss");
                string filename = string.Format(HttpContext.Current.Session["PrintName"] + DateTime.Now.ToString("yyMMddhhmmss") + ".xlsx");
                FileInfo newFile = new FileInfo(Path.Combine(dir, filename));

                string apptemplatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Content\Template", templateFilename);
                FileInfo templateFile = new FileInfo(apptemplatePath);
                using (ExcelPackage package = new ExcelPackage(newFile, templateFile))
                {
                    ExcelWorksheet Sheet1 = package.Workbook.Worksheets["Sheet1"];
                    if (SheetName1 != "")
                    {
                        Sheet1.Name = SheetName1;
                    }
                    else
                    {
                        Sheet1.Name = HttpContext.Current.Session["PrintName"].ToString();
                    }
                    for (int i = 1; i <= Convert.ToInt32(HttpContext.Current.Session["PrintCol"]); i++)
                    {
                        string column = GetExcelColumnName(i);
                        var list = HttpContext.Current.Session["PrintData"] as List<ExcelColumns>;
                        var data = list.Select(x => x.GetType().GetProperty(column).GetValue(x)).ToList();
                        int row = 5;
                        for (int x = 0; x <= data.Count - 1; x++)
                        {
                            string value = data[x].ToString();
                            int isInt = 0;

                            double isDouble = 0.00;
                            if (int.TryParse(value, out isInt))
                            {
                                Sheet1.Cells[column + row.ToString()].Value = Convert.ToInt64(value);
                            }
                            else if (Double.TryParse(value, out isDouble))
                            {
                                Sheet1.Cells[column + row.ToString()].Value = Convert.ToDouble(value);
                            }
                            else
                            {
                                Sheet1.Cells[column + row.ToString()].Value = value;
                            }
                            if(row == 4)
                            {
                                Sheet1.Cells[column + "4"].Style.Font.Bold = true;
                            }
                            Sheet1.Cells[column + row.ToString()].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            Sheet1.Cells[column + row.ToString()].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            Sheet1.Cells[column + row.ToString()].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            Sheet1.Cells[column + row.ToString()].Style.Border.Right.Style = ExcelBorderStyle.Thin;

                            row++;
                        }
                    }

                    Sheet1.Cells["A4:" + GetExcelColumnName(Convert.ToInt32(HttpContext.Current.Session["PrintCol"])) + "4"].Style.Font.Bold = true;
                    Sheet1.Cells["A:AZ"].AutoFitColumns();
                    Sheet1.PrinterSettings.FitToPage = true;
                    Sheet1.PrinterSettings.FitToHeight = 0;

                    Sheet1.PrinterSettings.BottomMargin = Convert.ToDecimal(0.28);
                    Sheet1.PrinterSettings.FooterMargin = Convert.ToDecimal(0.28);
                    Sheet1.PrinterSettings.HeaderMargin = Convert.ToDecimal(0.28);
                    Sheet1.PrinterSettings.LeftMargin = Convert.ToDecimal(0.28);
                    Sheet1.PrinterSettings.RightMargin = Convert.ToDecimal(0.28);
                    Sheet1.PrinterSettings.TopMargin = Convert.ToDecimal(0.28);

                    HttpContext.Current.Session["PrintData"] = null;
                    HttpContext.Current.Session["PrintCol"] = null;
                    HttpContext.Current.Session["PrintName"] = null;
                    return package.GetAsByteArray();
                }

            }
            catch (Exception err)
            {
                string errmsg;
                if (err.InnerException != null)
                    errmsg = "An error occured: " + err.InnerException.ToString();
                else
                    errmsg = "An error occured: " + err.Message.ToString();

                return null;
            }
        }
        public static byte[] DownloadCsv()
        {
            try
            {
                string csv = "";

                var list = HttpContext.Current.Session["PrintData"] as List<ExcelColumns>;
                for (int x = 0; x <= list.Count - 1; x++)
                {
                    for (int i = 1; i <= Convert.ToInt32(HttpContext.Current.Session["PrintCol"]); i++)
                    {
                        string column = GetExcelColumnName(i);
                        csv += list.Select(v => v.GetType().GetProperty(column).GetValue(v)).ToList()[x].ToString().Replace(",", "") + ","; ;
                    }
                    csv += Environment.NewLine;
                }
                //    for (int i = 1; i <= Convert.ToInt32(HttpContext.Current.Session["PrintCol"]); i++)
                //{
                //    string column = GetExcelColumnName(i);
                //    var list = HttpContext.Current.Session["PrintData"] as List<ExcelColumns>;
                //    var data = list.Select(x => x.GetType().GetProperty(column).GetValue(x)).ToList();

                //    csv += Environment.NewLine;
                //    for (int x = 0; x <= data.Count - 1; x++)
                //    {
                //        string value = data[x].ToString();
                //        csv += value.Replace(",", "") + ",";
                //    }
                //}
                return new System.Text.UTF8Encoding().GetBytes(csv);
            }
            catch (Exception err)
            {
                string errmsg;
                if (err.InnerException != null)
                    errmsg = "An error occured: " + err.InnerException.ToString();
                else
                    errmsg = "An error occured: " + err.Message.ToString();

                return null;
            }
        }

        public static string GetExcelColumnName(int columnNumber)
        {
            int dividend = columnNumber;
            string columnName = String.Empty;
            int modulo;

            while (dividend > 0)
            {
                modulo = (dividend - 1) % 26;
                columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
                dividend = (int)((dividend - modulo) / 26);
            }
            return columnName;
        }
    }
}