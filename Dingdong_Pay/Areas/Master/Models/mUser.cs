using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dingdong_Pay.Areas.Master.Models
{
    public class mUser
    {
        public int ID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string FullName { get; set; }
        public string MobileNo { get; set; }
        public string BirthDay { get; set; }
        public string Role { get; set; }
        public string Status { get; set; }
        public DateTime UpdateDate { get; set; }
    }
}