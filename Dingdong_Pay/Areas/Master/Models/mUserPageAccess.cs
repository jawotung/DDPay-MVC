using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace Dingdong_Pay.Areas.Master.Models
{
    public class mUserPageAccess
    {
        public string ID { get; set; }
        [Required(ErrorMessage = "UserID value is required")]
        public string UserID { get; set; }

        [Required(ErrorMessage = "PageID value is required")]
        public string PageID { get; set; }
        public bool Status { get; set; }
        public int ReadAndWrite { get; set; }
        public int Delete { get; set; }
        public string UpdateDate { get; set; }
    }
}