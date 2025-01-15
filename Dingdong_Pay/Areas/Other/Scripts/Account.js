"use strict";
(function () {
    var ajax = $D();
    var DataSelected;
    var Status = 10;
    $(document).ready(function () {
         //---1st Tab---\\
        GetUser();
        $(".btnEditAccount").click(function (e) {
            var parent = $(this).attr("data-parent");
            $("#div" + parent + "Label").hide();
            $("#div" + parent + "Form").show();
        });
        $(".btnCancel").click(function (e) {
            var parent = $(this).attr("data-parent");
            $("#div" + parent + "Label").show();
            $("#div" + parent + "Form").hide();
        });

        $("#frmName").submit(function (e) {
            e.preventDefault();
            var parent = $(this).attr("data-parent");
            ajax.formData = $(this).serializeArray();
            ajax.formAction = '.../../../Login/SaveUser';
            ajax.setJsonData().sendData().then(function () {
                Clear(parent)
            });
        });
        $("#frmUsername").submit(function (e) {
            e.preventDefault();
            var parent = $(this).attr("data-parent");
            ajax.formData = $(this).serializeArray();
            ajax.formAction = '.../../../Login/SaveUser';
            ajax.setJsonData().sendData().then(function () {
                Clear(parent)
            });
        });
        $("#frmEmail").submit(function (e) {
            e.preventDefault();
            var parent = $(this).attr("data-parent");
            ajax.formData = $(this).serializeArray();
            ajax.formAction = '.../../../Login/SaveUser';
            ajax.setJsonData().sendData().then(function () {
                Clear(parent)
            });
        });
        $("#frmMobileNo").submit(function (e) {
            e.preventDefault();
            var parent = $(this).attr("data-parent");
            ajax.formData = $(this).serializeArray();
            ajax.formAction = '.../../../Login/SaveUser';
            ajax.setJsonData().sendData().then(function () {
                Clear(parent)
            });
        });
        $("#frmBirthDay").submit(function (e) {
            e.preventDefault();
            var parent = $(this).attr("data-parent");
            ajax.formData = $(this).serializeArray();
            ajax.formAction = '.../../../Login/SaveUser';
            ajax.setJsonData().sendData().then(function () {
                Clear(parent)
            });
        });

        //---2nd Tab---\\
        CountAccount();
        GetAccountList();

        $("#btnSDEdit").click(function (e) {
            EditAccount(DataSelected);
        });
        $("#btnSDDelete").click(function (e) {
            DeleteAccount([DataSelected.ID]);
        });

        $('#Types').select2({
            ajax: {
                url: "/Select2/GetSelect2Data",
                data: function (params) {
                    return {
                        q: params.term,
                        id: 'ID',
                        text: "Value",
                        table: 'mGeneral',
                        db: 'Dingdong_Pay',
                        condition: ' AND TypeID = 2',
                        display: 'id&text',
                        orderBy: ' ORDER BY Value '
                    };
                },
            },
            placeholder: '--Please Select--',
            width: 'auto',
            theme: 'bootstrap4'
        });
        $('#Bank').select2({
            ajax: {
                url: "/Select2/GetSelect2Data",
                data: function (params) {
                    return {
                        q: params.term,
                        id: 'ID',
                        text: "Value",
                        table: 'mGeneral',
                        db: 'Dingdong_Pay',
                        condition: ' AND TypeID = 3',
                        display: 'id&text',
                        orderBy: ' ORDER BY Value '
                    };
                },
            },
            placeholder: '--Please Select--',
            width: 'auto',
            theme: 'bootstrap4'
        });

        $("#Types").change(function (e) {
            if ($(this).val() == 5) {
                $("#divCreditCard").show();
            } else {
                $("#divCreditCard").hide();
            }
        });

        $("#btnAddPaymentAccount").click(function () {
            $("#btnDelete").css("display", "none");
            $("#mdlAccount").modal("show");
            PaymentReload();
        });
        $("#frmAccounts").submit(function (e) {
            e.preventDefault();
            ajax.formData = $('#frmAccounts').serializeArray();
            ajax.formAction = '/Other/Account/SaveData';
            ajax.setJsonData().sendData().then(function () {
                PaymentReload();
            });
        });
        $("#btnSaveForm").click(function (e) {
            $("#frmAccounts").addClass('was-validated');
        });
    });

    //---1st Tab---\\
    function GetUser() {
        ajax.formAction = "/Other/Account/GetUser";
        ajax.jsonData = {};
        ajax.sendData().then(function () {
            populateToView(ajax.responseData, "lbl");
            populateToInput(ajax.responseData, "");
        });
    }
    function populateToView(data,start) {
        $.each(data, function (key, value) {
            var x = value == "" ? "N/A" : value;
            $("#" + start + key).text(x);
        });
    }
    function populateToInput(data, start) {
        $.each(data, function (key, value) {
            var x = value == "" ? "N/A" : value;
            console.log("#" + key);
            $("#" + key).val(x);
        });
    }
    function Clear(parent) {
        GetUser();
        $("#div" + parent + "Label").show();
        $("#div" + parent + "Form").hide();
    }

    //---2nd Tab---\\
    function GetAccountList() {
        ajax.formAction = "/Other/Account/GetAccountList";
        ajax.jsonData = {};
        ajax.sendData().then(function () {
            DisplayAccount(ajax.responseData);
        });
    }
    function DisplayAccount(x) {
        var elHtml = "";
        $("#divAccountlList").html("");
        $.each(x, function (k, v) {
            if (k == 0)
                PopulateSD(v);
            elHtml += "<div class='card ecommerce-card DivAccount' data-list='" + JSON.stringify(v) + "'>" +
                        '<div class="item-img">' +
                            '<div class="row" style="height:100%">' +
                                '<div class="col-8" style="padding-top: 20px;">' +
                                    '<div style="width: 75px; height: 75px; background: #EAE9F7; border-radius: 100px; margin: 0px 24px;">' +
                                        '<img src=".../../../Areas/Master/Upload/Img/TypeOfPayment/' + v.Types + '.png" style="width: 75px; height: 75px; background: #EAE9F7; border-radius: 100px;" />' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>                           ' +
                        '<div class="card-body" style="border: 0px;">' +
                            '<div class="item-name">' +
                                '<h6 class="mb-0">' +
                                    '<label class="text-body" style="font-size:20px;color:black;font-weight:bold;padding-right:50px">' + v.BankName + '</label>' +
                                    '<button type="button" class="btn btn-icon btn-flat-primary  waves-effect btnEdit"><i class="icons8-black-edit"></i></button> ' +
                                '</h6>' +
                                '<span class="delivery-date text-muted" style="line-height:30px">' + v.Account + '</span><br />' +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="item-options text-center">' +
                            '<div class="item-wrapper" style="height:100%">' +
                                '<div class="item-cost">' +
                                    '<span class="delivery-date" style="color:#979597">Linked on ' + v.CreateDate + '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        });
        $("#divAccountlList").html(elHtml);
        AccountEvent();
    }
    function AccountEvent() {
        $('.DivAccount').off('click')
        $('.DivAccount').on('click', function (e) {
            PopulateSD($(this).data("list"));
        });

        $('.btnEdit').off('click')
        $('.btnEdit').on('click', function (e) {
            EditAccount($($(this)[0].parentElement.parentElement.parentElement.parentElement).data("list"));
        });

        $('.btnMarkAsPaid').off('click');
        $(".btnMarkAsPaid").on("click", function () {
            ShowMarkAsPaid($(this).attr("data-ID"));
        });

        $('.CheckItem').off('change');
        $(".CheckItem").on("change", function () {
            var data = [];
            $('.CheckItem').each(function () {
                if ($(this).is(":checked")) {
                    data.push($(this).attr("data-ID"));
                }
            });

            iziToast.destroy();
            if (data.length != 0)
                ToastShow(data.length);
        });

        $('.btnPay').off('click');
        $(".btnPay").on("click", function () {
            PayBillDetails([$(this).attr("data-ID")]);
        });
        
    }
    function PopulateSD(x) {
        GetTransactionList(x.ID)
        DataSelected = x;
        $("#sdTypesName").text(x.TypesName);
        $("#sdBankName").text(x.BankName);
        $("#sdAccountNumber").text(x.AccountNumber);
        $("#sdAccount").text(x.Account);
        $("#sdAccountNumber").text(x.AccountNumber);
        $("#sdCreateDate").text(x.CreateDate);
    }
    function EditAccount(x) {
        ajax.populateToFormInputs(x, "#frmAccounts");
        var TypesOp = new Option(x.TypesName, x.Types, true, true);
        $('#Types').append(TypesOp).trigger('change');
        var BankOp = new Option(x.BankName, x.Bank, true, true);
        $('#Bank').append(BankOp).trigger('change');
        $("#mdlAccount").modal("show");
    }
    function DeleteAccount(x) {
        var mTitle = "Delete " + x.length + " Items";
        var msg = "Are you sure you want to delete " + x.length + "  items from your bill. You will not be able to undo the action once deleted."
        ajax.DeleteConfirm(mTitle, msg).then(function (approve) {
            if (approve) {
                ajax.formAction = '/Other/Account/DeleteData';
                ajax.jsonData = { ID: x };
                ajax.sendData().then(function () {
                    PaymentReload();
                });
            }
        });
    }

    function GetTransactionList(ID) {
        ajax.formAction = "/Other/Account/GetTransactionList";
        ajax.jsonData = { iAccount : 0};
        ajax.sendData().then(function () {
        });
    }

    function CountAccount() {
        //ajax.formAction = "/Transaction/Account/GetBillerList";
        //ajax.jsonData = {};
        //ajax.sendData().then(function () {
        //    if (ajax.responseData) {
        //        $(".HaveBillData").show();
        //        $(".NoBillData").hide();
        //    } else {
        //        $(".NoBillData").show();
        //        $(".HaveBillData").hide();
        //    }
        //});
    }

    function PaymentReload() {
        ajax.clearFromData("frmAccounts");
        GetAccountList();
        $("#mdlAccount").modal("hide");
    }
})();