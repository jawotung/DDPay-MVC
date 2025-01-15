using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dingdong_Pay.Areas.Transaction.Models
{
    public class mExpenses
    {
        public int ID { get; set; }
        public string Expenses { get; set; }
        public string ExpensesName { get; set; }
        public string ExpensesChild { get; set; }
        public string Account { get; set; }
        public string AccountName { get; set; }
        public string Amount { get; set; }
        public string InputDate { get; set; }
        public string Notes { get; set; }
        public string IsDeleted { get; set; }
        public string CreateID { get; set; }
        public string CreateDate { get; set; }
        public string UpdateID { get; set; }
        public string UpdateDate { get; set; }
    }
}