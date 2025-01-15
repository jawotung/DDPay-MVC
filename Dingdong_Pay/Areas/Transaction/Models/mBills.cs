using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dingdong_Pay.Areas.Transaction.Models
{
    public class mBills
    {
        public int ID { get; set; }
        public string Biller { get; set; }
        public string BillTitle { get; set; }
        public string CAN { get; set; }
        public string Amount { get; set; }
        public string ExpenseTypeID { get; set; }
        public string ExpenseType { get; set; }
        public string Purpose { get; set; }
        public string Note { get; set; }
        public string DueDate { get; set; }
        public string DueDateName { get; set; }
        public string DueMonth { get; set; }
        public string Document { get; set; }
        public int RecurringOptions { get; set; }
        public string Frequency { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int ReminderOptions { get; set; }
        public string ReminderType { get; set; }
        public string ReminderNo { get; set; }
        public string ReminderMode { get; set; }
        public string CreateDate { get; set; }
        public string LastPayment { get; set; }
        public int GroupMonth { get; set; }
        public int isPaid { get; set; }
        public int Status { get; set; }
        public string ReferenceNo { get; set; }
        public string PaidDate { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentDocument { get; set; }
    }

}