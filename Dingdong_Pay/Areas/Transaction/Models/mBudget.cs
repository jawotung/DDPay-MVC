using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dingdong_Pay.Areas.Transaction.Models
{
    public class mBudget
    {
        public int ID { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Amount { get; set; }
        public string Spend { get; set; }
        public int Repeatbudget { get; set; }
        public int BreakdownYear { get; set; }
        public int? Breakdown { get; set; }
        public string IsDeleted { get; set; }
        public string CreateID { get; set; }
        public string CreateDate { get; set; }
        public string UpdateID { get; set; }
        public string UpdateDate { get; set; }
    }
    public class mExpense
    {
        public int ID { get; set; }
        public int ExpenseTypeID { get; set; }
        public string ExpenseType { get; set; }
        public string ExpenseAmount { get; set; }
        public string SpendAmount { get; set; }
        public int isAllBudget { get; set; }
        public string IsDeleted { get; set; }
        public string CreateID { get; set; }
        public string CreateDate { get; set; }
        public string UpdateID { get; set; }
        public string UpdateDate { get; set; }
    }
}