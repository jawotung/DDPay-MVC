using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dingdong_Pay.Areas.Transaction.Models
{
    public class mAccount
    {
        public int ID { get; set; }
        public string Types { get; set; }
        public string Bank { get; set; }
        public string Account { get; set; }
        public string Currency { get; set; }
        public string Amount { get; set; }
        public string TypesName { get; set; }
        public string BankName { get; set; }
        public string CurrencyName { get; set; }
        public string Payment { get; set; }
        public string DisplayName { get; set; }
    }
}