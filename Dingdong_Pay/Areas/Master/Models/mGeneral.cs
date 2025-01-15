using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dingdong_Pay.Areas.Master.Models
{
    public class mGeneral
    {
        public int ID { get; set; }
        public int TypeID { get; set; }
        public string TypeDesc { get; set; }
        public string Value { get; set; }
        public string UpdateDate { get; set; }
    }
}