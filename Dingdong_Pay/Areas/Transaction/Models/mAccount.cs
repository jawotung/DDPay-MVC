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
        public string AccountNumber { get; set; }
        public string TypesName { get; set; }
        public string BankName { get; set; }
        public string ExpirationDate { get; set; }
        public string CVCCVV { get; set; }
        public string CreateDate { get; set; }
    }
}