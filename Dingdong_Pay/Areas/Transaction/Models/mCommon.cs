using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dingdong_Pay.Areas.Transaction.Models
{
    public class mCommon
    {
        public int ID { get; set; }
        public string Year { get; set; }
        public string Month { get; set; }
        public string InputDate { get; set; }
        public string FullDate { get; set; }
        public string Expenses { get; set; }
        public string ExpensesName { get; set; }
        public string TotalTransaction { get; set; }
        public string TotalAmount { get; set; }
        public double Percentage { get; set; }
        public string Remaining { get; set; }
        public string ExpensesAmount { get; set; }
        public string Notes { get; set; }
        public string Transaction { get; set; }
    }
}