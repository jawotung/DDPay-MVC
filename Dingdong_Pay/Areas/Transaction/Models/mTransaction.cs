using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dingdong_Pay.Areas.Transaction.Models
{
    public class mTransaction
    {
        public int ID { get; set; }
        public string Amount { get; set; }
        public string ExpenseTypeID { get; set; }
        public string ExpenseType { get; set; }
        public string Note { get; set; }
        public string Document { get; set; }
        public string TransactionDate { get; set; }
        public string TransactionDateName { get; set; }
        public int RecurringOptions { get; set; }
        public string Frequency { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }

}