using System.Web;
using System.Web.Optimization;

namespace Dingdong_Pay
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            string googleFonts = "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700";
            string[] LayoutJS = new string[]
            {
                "~/Content/app-assets/vendors/js/vendors.min.js",
                "~/Content/app-assets/js/core/app-menu.js",
                "~/Content/app-assets/js/core/app.js",
                "~/Content/app-assets/js/scripts/components.js",
                "~/Content/js/lodash.min.js",
                "~/Content/js/apps.min.js",
                "~/Scripts/Menu.js",
                "~/Content/js/Custom.js",
                "~/Content/assets/plugins/select2/dist/js/select2.full.js",
                "~/Content/app-assets/vendors/js/pickers/pickadate/picker.js",
                "~/Content/app-assets/vendors/js/pickers/pickadate/picker.date.js",
                "~/Content/app-assets/vendors/js/pickers/pickadate/picker.time.js",
                "~/Content/app-assets/vendors/js/pickers/pickadate/legacy.js",
                "~/Content/app-assets/vendors/js/pickers/flatpickr/flatpickr.min.js",
                "~/Content/app-assets/vendors/js/file-uploaders/dropzone.min.js",
                "~/Content/app-assets/vendors/js/extensions/toastr.min.js",
                "~/Content/app-assets/js/scripts/forms/pickers/form-pickers.js",
                "~/Content/app-assets/js/scripts/forms/form-file-uploader.js",
                //"~/Content/app-assets/fonts/font-awesome/js/all.min.js",
                "~/Content/app-assets/vendors/js/tables/datatable/pdfmake.min.js",
                "~/Content/app-assets/vendors/js/tables/datatable/datatables.min.js",
                "~/Content/app-assets/vendors/js/tables/datatable/datatables.buttons.min.js",
                "~/Content/app-assets/vendors/js/tables/datatable/buttons.html5.min.js",
                "~/Content/app-assets/vendors/js/tables/datatable/buttons.print.min.js",
                "~/Content/app-assets/vendors/js/tables/datatable/buttons.bootstrap.min.js",
                "~/Content/app-assets/vendors/js/tables/datatable/datatables.bootstrap4.min.js",
                "~/Content/app-assets/js/scripts/datatables/datatable.js",
                "~/Content/app-assets/js/scripts/datatables/media/js/dataTables.bootstrap.js",
                "~/Content/app-assets/js/scripts/datatables/media/js/dataTables.bootstrap4.js",
                "~/Content/app-assets/js/scripts/datatables/extensions/js/dataTables.responsive.min.js",
                "~/Content/app-assets/vendors/js/tables/datatable/dataTables.responsive.min.js",
                "~/Content/app-assets/vendors/js/tables/datatable/datatables.min.js",
                "~/Content/assets/plugins/iziToast/dist/js/iziToast.js",
                "~/Content/assets/plugins/Parsleyjs/dist/parsley.min.js",
                "~/Content/app-assets/vendors/js/extensions/sweetalert2.all.min.js",
                "~/Content/js/common/Message.js",
                "~/Content/js/common/Formatter.js",
                "~/Content/js/common/CustomUI.js",
                "~/Content/js/common/Data.js",
                "~/Scripts/common.js",
            };
            string[] LayoutCSS = new string[]
            {
                "~/Content/app-assets/vendors/css/vendors.min.css",
                "~/Content/app-assets/css/bootstrap.css",
                "~/Content/app-assets/css/bootstrap-extended.css",
                "~/Content/app-assets/css/colors.css",
                "~/Content/app-assets/css/components.css",
                "~/Content/app-assets/css/themes/dark-layout.css",
                "~/Content/app-assets/css/themes/semi-dark-layout.css",
                "~/Content/app-assets/css/core/menu/menu-types/vertical-menu.css",
                "~/Content/app-assets/css/core/colors/palette-gradient.css",
                "~/Content/assets/css/style.css",
                "~/Content/app-assets/vendors/css/file-uploaders/dropzone.min.css",
                "~/Content/assets/plugins/select2/dist/css/select2.css",
                "~/Content/assets/plugins/select2/dist/css/select2-bootstrap4.css",
                "~/Content/app-assets/vendors/css/pickers/pickadate/pickadate.css",
                "~/Content/app-assets/vendors/css/pickers/flatpickr/flatpickr.min.css",
                "~/Content/app-assets/css/plugins/forms/pickers/form-flat-pickr.css",
                "~/Content/app-assets/css/plugins/forms/pickers/form-pickadate.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/main.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/DDP Icons - Black/css/styles.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/DDP Icons - Blue/css/styles.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/DDP Icons - Dark Grey/css/styles.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/DDP Icons - Green/css/styles.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/DDP Icons - Grey/css/styles.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/DDP Icons - Light Grey/css/styles.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/DDP Icons - Purple/css/styles.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/DDP Icons - Red/css/styles.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/DDP Icons - White/css/styles.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/Expense-Type-Icons/css/styles.css",
                "~/Content/app-assets/fonts/Sel-Icons/DDP Icons/Icons/DDP Icons - White/preview/preview.css",
                "~/Content/app-assets/vendors/css/extensions/toastr.min.css",
                "~/Content/app-assets/css/plugins/extensions/toastr.css",
                "~/Content/app-assets/vendors/css/tables/datatable/datatables.min.css",
                "~/Content/app-assets/js/scripts/datatables/extensions/Responsive/css/responsive.dataTables.css",
                "~/Content/assets/plugins/iziToast/dist/css/iziToast.css",
                "~/Content/assets/plugins/Parsleyjs/src/parsley.min.css",
                "~/Content/app-assets/vendors/css/extensions/sweetalert2.min.css",
                "~/Content/Site.css"
            };

            bundles.Add(new Bundle("~/Home-CSS", googleFonts)
                    .Include(LayoutCSS)
            );

            bundles.Add(new Bundle("~/Home-JS")
                    .Include(LayoutJS)
                    .Include(
                        "~/Scripts/Home.js"
                    )
            );
            bundles.Add(new Bundle("~/Login-CSS", googleFonts)
                   .Include(LayoutCSS)
            );

            bundles.Add(new Bundle("~/Login-JS")
                    .Include(LayoutJS)
                    .Include(
                        "~/Scripts/Login.js"
                    )
            );
            bundles.Add(new Bundle("~/CreateUser-CSS", googleFonts)
                   .Include(LayoutCSS)
            );

            bundles.Add(new Bundle("~/CreateUser-JS")
                    .Include(LayoutJS)
                    .Include(
                        "~/Scripts/CreateUser.js"
                    )
            );

            bundles.Add(new Bundle("~/ForgotPassword-CSS", googleFonts)
                   .Include(LayoutCSS)
            );

            bundles.Add(new Bundle("~/ForgotPassword-JS")
                    .Include(LayoutJS)
                    .Include(
                        "~/Scripts/ForgotPassword.js"
                    )
            );

            bundles.Add(new Bundle("~/OTTP-CSS", googleFonts)
                   .Include(LayoutCSS)
            );

            bundles.Add(new Bundle("~/OTTP-JS")
                    .Include(LayoutJS)
                    .Include(
                        "~/Scripts/OTTP.js"
                    )
            );

            bundles.Add(new Bundle("~/ResetPassword-CSS", googleFonts)
                   .Include(LayoutCSS)
            );

            bundles.Add(new Bundle("~/ResetPassword-JS")
                    .Include(LayoutJS)
                    .Include(
                        "~/Scripts/ResetPassword.js"
                    )
            );

            bundles.Add(new Bundle("~/PasswordSuccess-CSS", googleFonts)
                   .Include(LayoutCSS)
            );

            bundles.Add(new Bundle("~/PasswordSuccess-JS")
                    .Include(LayoutJS)
                    .Include(
                        "~/Scripts/PasswordSuccess.js"
                    )
            );


            MasterBundles(bundles, LayoutJS, LayoutCSS);
            TransactionBundles(bundles, LayoutJS, LayoutCSS);
            OtherBundles(bundles, LayoutJS, LayoutCSS);
        }
        public static void MasterBundles(BundleCollection bundles, string[] LayoutJS, string[] LayoutCSS)
        {
            bundles.Add(new Bundle("~/User-CSS")
                    .Include(LayoutCSS)
            );
            bundles.Add(new Bundle("~/User-Js")
                    .Include(LayoutJS)
                    .Include(
                        "~/Areas/Master/Scripts/User.js"
                    )
            );

            bundles.Add(new Bundle("~/General-CSS")
                    .Include(LayoutCSS)
            );
            bundles.Add(new Bundle("~/General-Js")
                    .Include(LayoutJS)
                    .Include(
                        "~/Areas/Master/Scripts/General.js"
                    )
            );
        }
        public static void TransactionBundles(BundleCollection bundles, string[] LayoutJS, string[] LayoutCSS)
        {
            bundles.Add(new Bundle("~/Bills-CSS")
                    .Include(LayoutCSS)
            );
            bundles.Add(new Bundle("~/Bills-Js")
                    .Include(LayoutJS)
                    .Include(
                        "~/Areas/Transaction/Scripts/Bills.js"
                    )
            );

            bundles.Add(new Bundle("~/Expenses-CSS")
                    .Include(LayoutCSS)
            );
            bundles.Add(new Bundle("~/Expenses-Js")
                    .Include(LayoutJS)
                    .Include(
                        "~/Areas/Transaction/Scripts/Expenses.js"
                    )
            );

            bundles.Add(new Bundle("~/Budget-CSS")
                    .Include(LayoutCSS)
            );
            bundles.Add(new Bundle("~/Budget-Js")
                    .Include(LayoutJS)
                    .Include(
                        "~/Areas/Transaction/Scripts/Budget.js"
                    )
            );

            bundles.Add(new Bundle("~/Accounts-CSS")
                    .Include(LayoutCSS)
            );
            bundles.Add(new Bundle("~/Accounts-Js")
                    .Include(LayoutJS)
                    .Include(
                        "~/Areas/Transaction/Scripts/Accounts.js"
                    )
            );

            bundles.Add(new Bundle("~/Income-CSS")
                    .Include(LayoutCSS)
            );
            bundles.Add(new Bundle("~/Income-Js")
                    .Include(LayoutJS)
                    .Include(
                        "~/Areas/Transaction/Scripts/Income.js"
                    )
            );

            bundles.Add(new Bundle("~/Transaction-CSS")
                    .Include(LayoutCSS)
            );
            bundles.Add(new Bundle("~/Transaction-Js")
                    .Include(LayoutJS)
                    .Include(
                        "~/Areas/Transaction/Scripts/Transaction.js"
                    )
            );

        }
        public static void OtherBundles(BundleCollection bundles, string[] LayoutJS, string[] LayoutCSS)
        {
            bundles.Add(new Bundle("~/Account-CSS")
                    .Include(LayoutCSS)
            );
            bundles.Add(new Bundle("~/Account-Js")
                    .Include(LayoutJS)
                    .Include(
                        "~/Areas/Other/Scripts/Account.js"
                    )
            );

            bundles.Add(new Bundle("~/Settings-CSS")
                    .Include(LayoutCSS)
            );
            bundles.Add(new Bundle("~/Settings-Js")
                    .Include(LayoutJS)
                    .Include(
                        "~/Areas/Other/Scripts/Settings.js"
                    )
            );
        }

    }
}
