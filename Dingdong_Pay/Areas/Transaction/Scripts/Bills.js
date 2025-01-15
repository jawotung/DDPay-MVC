"use strict";
(function () {
    var ajax = $D();
    var tblAll = "";
    var DataSelected;
    var Status = 10;
    var isManual = false;
    $(document).ready(function () {
        CountBills();
        GetBillsList();
        GetBillerList();

        $('#ExpenseType').select2({
            ajax: {
                url: "/Select2/GetSelect2Data",
                data: function (params) {
                    return {
                        q: params.term,
                        id: 'ID',
                        text: "Value",
                        table: 'mGeneral',
                        db: 'Dingdong_Pay',
                        condition: ' AND TypeID = 1',
                        display: 'id&text',
                        orderBy: ' ORDER BY Value '
                    };
                },
            },
            placeholder: '--Please Select--',
            width: 'auto',
            theme: 'bootstrap4'
        });

        $(".tabsStatus").click(function () {
            Status = $(this).attr("data-status");
            GetBillsList();
        });
        $("#btnAddBill,#btnNoBillsAdd").click(function () {
            isManual = false;
            AddBill();
        });
        
        $("#btnAddManual").click(function () {
            isManual = true;
            ShowAllForm();
        });
        $("#Biller").change(function () {
            ShowAllForm();
            if (!isManual) {
                $(".LinkBiller").show();
            }
            else {
                $(".LinkBiller").hide();
                $(".LinkAccount").hide();
            }

        });
        $("#RecurringOptions").change(function () {
            $(".txtRecurring").val("");
            if ($(this).is(":checked")) {
                $(".Recurring").show();
            } else {
                $(".Recurring").hide();
            }
        });
        $("#ReminderOptions").change(function () {
            $(".txtReminder").val("");
            if ($(this).is(":checked")) {
                $(".Reminder").show();
            } else {
                $(".Reminder").hide();
            }
            $('.btnRemoveNotification').each(function (i, x) {
                if (i > 0)
                    $($(this)[0].parentElement.parentElement.parentElement).remove();
            });
        });
        $("#btnAddNotification").click(function () {
            var elHtml = $(".ReminderNotification")[0].outerHTML;
            $("#divReminderNotification").append(elHtml);
            $('.btnRemoveNotification').each(function (i, x) {
                if (i == 0)
                    $(this).css("display", "none");
                else
                    $(this).css("display", "block");
            });
            $(".btnRemoveNotification").off("click");
            $(".btnRemoveNotification").click(function () {
                $($(this)[0].parentElement.parentElement.parentElement).remove();
            });
        });
        $("#LinkBiller").change(function () {
            $(".txtLinkAccount").val("");
            $('#AutoPayAccount')[0].checked = false;
            if ($(this).is(":checked")) {
                $(".LinkAccount").show();
            } else {
                $(".LinkAccount").hide();
            }
        });     
        $("#AutoPayAccount").change(function () {
            if ($(this).is(":checked")) {
                $("#mdlAccount").modal("show");
            } else {
                $("#mdlAccount").modal("hide");
            }
        });
        $(".divBoxPayment").click(function () {
            $(".divBoxPayment").removeClass("divBoxPaymentactive");
            $(this).addClass("divBoxPaymentactive");
        });

        $("#btnSave").click(function (e) {
            $("#frmBill").addClass('was-validated');
        });
        $("#btnEdit").click(function (e) {
            EditBill(DataSelected);
        });
        $("#btnDelete").click(function (e) {
            DeleteBill([$("#ID").val()]);
        });
        $("#btnBatchDelete").click(function (e) {
            var data = [];
            tblAll.rows().every(function (index, element) {
                var row = $(this.node());
                if (row.find('.CheckItem').is(":checked")) {
                    data.push(tblAll.row(this).data().ID);
                }
            });
            if (data.length != 0)
                DeleteBill(data);
            else
                ajax.showError("Please check the checkbox in the table.");
        });
        $("#btnMarkAsPaid").click(function (e) {
            ShowMarkAsPaid(DataSelected.ID);
        });
        $("#btnPayNow").click(function (e) {
            var data = [];
            tblAll.rows().every(function (index, element) {
                var row = $(this.node());
                if (row.find('.CheckItem').is(":checked")) {
                    data.push(tblAll.row(this).data());
                }
            });
            if (ID.length != 0)
                PayNowDetails(data);
            else
                ajax.showError("Please check the checkbox in the table.");
        });
        
        $("#frmBill").submit(function (e) {
            e.preventDefault();
            var formData = new FormData(this);
            if ($('#Document')[0].files.length != 0) {
                formData.append("Document", $('#Document')[0].files[0]);
            }
            formData.append("RecurringOptions", ($('#RecurringOptions').is(":checked") ? 1 : 0));
            formData.append("ReminderOptions", ($('#ReminderOptions').is(":checked")? 1 : 0));
            ajax.jsonData = formData;
            ajax.formAction = '/Transaction/Bills/SaveData';
            ajax.sendFile().then(function () {
                $("#mdlAddBill").modal("hide");
                cancelUserForm();
            });
        });
        $("#frmMarkAsPaid").submit(function (e) {
            e.preventDefault();
            var formData = new FormData(this);
            if ($('#PaymentDocument')[0].files.length != 0) {
                formData.append("PaymentDocument", $('#PaymentDocument')[0].files[0]);
            }
            ajax.jsonData = formData;
            ajax.formAction = '/Transaction/Bills/MarkAsPaid';
            ajax.sendFile().then(function () {
                cancelUserForm();
                $("#mdlMarkAsPaid").modal("hide");
            });
        });

        $("#tblAll").on("click", ".btnPayNow", function () {
            var x = tblAll.row($(this).parents('tr')).data();
            PayNowDetails([x]);
        });

        $("#btnSDEdit").click(function (e) {
            EditBill(DataSelected);
        });
        $("#btnSDDelete").click(function (e) {
            DeleteBill([DataSelected.ID]);
        });
        $("#btnSDPay").click(function (e) {
            PayBillDetails([DataSelected.ID]);
        });
    });
    
    function GetBillerList() {
        ajax.formAction = "/Transaction/Bills/GetBillerList";
        ajax.jsonData = {};
        ajax.sendData().then(function () {
            DisplayBiller(ajax.responseData);
        });
    }
    function AddBill() {
        ajax.clearFromData("frmBill");
        $("#mdlSideBarSize").removeAttr("style");
        $("#col6Left").removeAttr("style");
        $("#col6Left").removeClass("col-sm-6");
        $("#col6Left").addClass("col-sm-12");
        $("#pAddManual").show();
        $(".Recurring").hide();
        $(".ManualBill").hide();
        $(".Reminder").hide();
        $(".foredit").hide();
        $(".LinkBiller").hide();
        $(".LinkAccount").hide();
        $("#btnSave").text("Add");
        $('#RecurringOptions')[0].checked = false;
        $('#ReminderOptions')[0].checked = false;
        $('#LinkBiller')[0].checked = false;
        $("#mdlAddBill").modal("show");
    }
    function cancelUserForm() {
        GetBillsList();
        GetBillerList();
        ajax.clearFromData("frmMarkAsPaid");
        ajax.clearFromData("frmBill");
    }
    function ShowAllForm() {
        $("#mdlSideBarSize").css("width", "50%");
        $("#col6Left").css("border-right", "1px solid #9d9d9da1");
        $("#col6Left").removeClass("col-sm-12");
        $("#col6Left").addClass("col-sm-6");
        $(".ManualBill").show();
        $("#pAddManual").hide();
    }
    function PayNowDetails(x) {
        var elHtml = "";
        var Subtotal = 0;
        $("#PaymentBody").html("");
        $.each(x, function (k, v) {
            Subtotal += parseFloat(v.Amount);
            elHtml += '<div class="transaction-item">' +
                    '<div class="media">' +
                        '<div class="avatar bg-default rounded">' +
                            '<div class="avatar-content">' +
                                '<i class="fa fa-home"></i>' +
                            '</div>' +
                        '</div>' +
                        '<div class="media-body">' +
                            '<h6 class="transaction-title font-weight-bolder">Meralco</h6>' +
                            '<small style="font-size: 12px;"><b>Acc no.:</b> <span style="color:#979597">' + v.CAN + '</span></small><br/>' +
                            '<small style="font-size: 12px;"><b>Bill title:</b> <span style="color:#979597">' + v.BillTitle + '</span></small><br />' +
                            '<small style="font-size: 12px;"><b>Due date:</b>  <span style="color:#979597">' + v.DueDateName + '</span></small><br />' +
                        '</div>' +
                    '</div>' +
                    '<div style="text-align:right"><span style="font-weight:bold">P ' + DecimalFormat(v.Amount) + '</span><br/><span style="font-size: 12px; color:#979597">Service fee </span><span style="font-weight:bold">P 25</span></div>' +
                '</div>';
            if ((k+1) != x.length)
                elHtml += "<hr>"
            else
                elHtml += "<br/>"
        });
        var ServiceFee = parseFloat(x.length) * 25;
        var TotalBill = parseFloat(Subtotal) + parseFloat(ServiceFee);
        $("#PaymentBody").html(elHtml);
        $("#Subtotal").text(DecimalFormat(Subtotal));
        $("#ServiceFee").text(DecimalFormat(ServiceFee));
        $("#TotalBill").text(DecimalFormat(TotalBill));
        $("#mdlPayment").modal("show");
    }

    function GetBillsList() {
        ajax.formAction = "/Transaction/Bills/GetBillsList";
        ajax.jsonData = { iStatus : Status};
        ajax.sendData().then(function () {
            DisplayBills(ajax.responseData);
        });
    }
    function DisplayBills(x) {
        var elHtml = "";
        $("#divBillList").html("");
        var LastStatus = "";
        $.each(x, function (k, v) {
            var PaidIcon = "icons8-black-in-progress";
            var diffTime = new Date() > new Date(v.DueDate) ? (Math.abs(new Date() - new Date(v.DueDate)) * -1) : 0;
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if (v.isPaid == 1)
                var PaidIcon = "icons8-black-ok";
            if (k == 0)
                PopulateSD(v);
            if (LastStatus != v.DueMonth)
                elHtml += '<div class="card"> ' +
                            '<div class="card-header"> ' +
                                '<div class="custom-control custom-control-primary custom-checkbox">' +
                                    '<input type="checkbox" class="custom-control-input CheckAll" id="' + v.DueMonth + '" data-Status="' + v.Status + '" data-ID="' + v.ID + '">' +
                                    '<label class="custom-control-label ' + (v.DueMonth == "Overdue" ? "text-danger" : "") +'" for="' + v.DueMonth + '">' + v.DueMonth  + '</label>' +
                                '</div>' +
                           '</div>  ' +
                        '</div>';

            elHtml += "<div class='card ecommerce-card DivBills' data-list='" + JSON.stringify(v) + "'>";
            elHtml +=    '<div class="item-img">' +
                            '<div class="row" style="height:100%">' +
                                '<div class="col-4" style="padding-top: 40px;">' +
                                    '<div class="custom-control custom-control-primary custom-checkbox" style="margin-left: 20px">' +
                                        '<input type="checkbox" class="custom-control-input CheckItem" id="' + v.ID + '" data-Status="' + v.Status + '" data-ID="' + v.ID + '">' +
                                        '<label class="custom-control-label" for="' + v.ID + '">    </label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-8" style="padding-top: 20px;">' +
                                    '<div style="width: 75px; height: 75px; background: #EAE9F7; border-radius: 100px; margin: 0px 24px;">' +
                                        '<img src=".../../../Areas/Master/Upload/Img/ExpenseType/' + v.ExpenseTypeID + '.png" style="width: 75px; height: 75px; background: #EAE9F7; border-radius: 100px;" />' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>                           ' +
                        '<div class="card-body" style="border: 0px;">' +
                            '<div class="item-name">' +
                                '<h6 class="mb-0">' +
                                    '<label class="text-body" style="font-size:20px;color:black;font-weight:bold;padding-right:50px">' + v.Biller + '</label>' +
                                    '<button type="button" class="btn btn-icon btn-flat-primary  waves-effect btnEdit"><i class="icons8-black-edit"></i></button> ' +
                                    '<button type="button" class="btn btn-icon btn-flat-success  waves-effect btnMarkAsPaid" ' + (v.isPaid == 1 ? "disabled" : "") + ' data-ID="' + v.ID + '"> <i class="' + PaidIcon + '"></i></button>' +
                                '</h6>' +
                                '<span class="delivery-date text-muted" style="line-height:30px">' + v.BillTitle + '</span><br />' +
                                '<span class="delivery-date text-danger" style="line-height: 30px">' + (v.isPaid == 0 && diffDays < 0 ? "Due " + (diffDays * -1) + " days ago" : "") + '</span><br /><br />' +
                                '<a class="btn oval-outline-purple btnPay" style="line-height: 30px;display: initial;line-height: 30px;display: initial;border: 2px solid #7573B6;border-radius: 12px;" data-ID="' + v.ID + '">' +
                                    '<span style="color:#7573B6" class="biller-body-p">Pay ' + DecimalFormat(v.Amount) + '</span>' +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="item-options text-center">' +
                            '<div class="item-wrapper" style="height:100%">' +
                                '<div class="item-cost">' +
                                    '<span class="delivery-date" style="color:#979597">' + v.DueDateName + '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            LastStatus = v.DueMonth;
        });
        $("#divBillList").html(elHtml);
        BillsEvent();
    }
    function BillsEvent() {
        $('.DivBills').off('click')
        $('.DivBills').on('click', function (e) {
            PopulateSD($(this).data("list"));
        });

        $('.btnEdit').off('click')
        $('.btnEdit').on('click', function (e) {
            EditBill($($(this)[0].parentElement.parentElement.parentElement.parentElement).data("list"));
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
        DataSelected = x;
        $("#btnSDPay").html("Pay " + DecimalFormat(x.Amount));
        $("#sdStatus").html(GetStatus(x.Status));
        $("#sdLastPayment").text(x.LastPayment);
        $("#sdBiller").text(x.Biller);
        $("#sdBillTitle").text(x.BillTitle);
        $("#sdCAN").text(x.CAN);
        $("#sdExpenseType").text(x.ExpenseType);
        $("#sdPurpose").text(x.Purpose);
        $("#sdNote").text(x.Note);
        $("#sdDocument").text(x.Document);
        $("#sdDueDate").text(x.DueDate);
        $("#sdAmount").text(DecimalFormat(x.Amount));
        $("#sdFrequency").text(x.Frequency);
        $("#sdStartDate").text(x.StartDate);
        $("#sdEndDate").text(x.EndDate);
        $("#sdCreateDate").text(x.CreateDate);
    }
    function ViewBill(x) {
        DataSelected = x;
        $("#ID").val(x.ID);
        $("#mdlPaymentTitle").text(x.Biller);
        $("#lblStatus").html(GetStatus(x.Status));
        $("#lblLastPayment").text(x.LastPayment);
        $("#lblBiller").text(x.Biller);
        $("#lblBillTitle").text(x.BillTitle);
        $("#lblCAN").text(x.CAN);
        $("#lblExpenseType").text(x.ExpenseType);
        $("#lblPurpose").text(x.Purpose);
        $("#lblNote").text(x.Note);
        $("#lblDocument").text(x.Document);
        $("#lblDueDate").text(x.DueDate);
        $("#lblAmount").text(x.Amount);
        $("#lblFrequency").text(x.Frequency);
        $("#lblStartDate").text(x.StartDate);
        $("#lblEndDate").text(x.EndDate);
        $("#lblCreateDate").text(x.CreateDate);
        $("#mdlView").modal("show");
    }
    function EditBill(x) {
        ShowAllForm();
        DataSelected = x;
        $("#frmBill").parsley().reset();
        $('#RecurringOptions').attr('checked', (x.RecurringOptions == 1 ? true : false)).change();
        $('#ReminderOptions').attr('checked', (x.ReminderOptions == 1 ? true : false)).change();
        $('#LinkBiller').attr('checked', false).change();
        ajax.populateToFormInputs(x, "#frmBill");

        var ExpensesOp = new Option(x.ExpenseType, x.ExpenseTypeID, true, true);
        $('#ExpenseType').append(ExpensesOp).trigger('change');
        $("#mdlView").modal("hide");
        $(".foredit").show();
        $("#btnSave").text("Save");
        $("#mdlAddBill").modal("show");
    }
    function DeleteBill(x) {
        var mTitle = "Delete " + x.length + " Items";
        var msg = "Are you sure you want to delete " + x.length + "  items from your bill. You will not be able to undo the action once deleted."
        ajax.DeleteConfirm(mTitle, msg).then(function (approve) {
            if (approve) {
                ajax.formAction = '/Transaction/Bills/DeleteData';
                ajax.jsonData = { ID: x };
                ajax.sendData().then(function () {
                    $("#mdlAddBill").modal("hide");
                    cancelUserForm();
                });
            }
        });
    }
    function PayBillDetails(ID) {
        ajax.formAction = "/Transaction/Bills/GetBills";
        ajax.jsonData = { ID: ID };
        ajax.sendData().then(function () {
            PayNowDetails(ajax.responseData);
        });
    }
    function ShowMarkAsPaid(ID) {
        $("#mdlView").modal("hide");
        $("#MarkAsPaidID").val(ID);
        $("#mdlMarkAsPaid").modal("show");
    }

    function DisplayBiller(x) {
        var elHtml = "";
        $("#divBillerList").html("");
        $.each(x, function (k, v) {
            elHtml += '<div class="mb-4 card-biller">' +
                        '<div class="card-body">' +
                            '<h4 class="card-title"><i class="fa fa-home"></i></h4>' +
                            '<div class="card-subtitle" style="font-weight: bold; font-size: 16px; line-height: 24px; padding-bottom: 10px;">' + v.Biller + '</div>' +
                            '<div class="card-text">' +
                                '<a class="oval-purple">' +
                                    '<span style="color:white"class="biller-body-p">' + v.BillTitle + '</span>' +
                                '</a>' +
                                '<p class="biller-body-p">Acc no. <b>' + v.CAN + '</b></p>' +
                                '<p class="biller-body-p">Next due at <b>' + v.DueDateName + '</b></p>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        });
        $("#divBillerList").html(elHtml);
    }

    function GetStatus(x) {
        if (x == 2)
            return '<span style="align-items: center;padding: 4px 8px;;border-radius: 12px;" class="btn-success">Paid</button>';
        else if (x == 1)
            return '<span style="align-items: center;padding: 4px 8px;;border-radius: 12px;" class="btn-danger">Overdue</button>';
        else
            return '<span style="align-items: center;padding: 4px 8px;;border-radius: 12px;" class="btn-secondary">Recurring</button>';
    }
    function BatchDelete() {
        var data = [];
        $('.CheckItem').each(function () {
            if ($(this).is(":checked")) {
                data.push($(this).attr("data-ID"));
            }
        });
        if (data.length != 0)
            DeleteBill(data);
        else
            ajax.showError("Please check the checkbox in the table.");
    }
    function BatchPayNow() {
        var data = [];
        $('.CheckItem').each(function () {
            if ($(this).is(":checked")) {
                data.push($(this).attr("data-ID"));
            }
        });

        if (data.length != 0) {
            PayBillDetails(data);
        }
        else
            ajax.showError("Please check the checkbox in the table.");
    }
    function ToastShow(x) {
        iziToast.show({
            theme: "dark",
            close: false,
            overlay: false,
            displayMode: 'once',
            id: 'inputs',
            zindex: 999,
            timeout: 0,
            drag: false,
            color: "#25215E",
            position: 'bottomCenter',
            inputs: [
                ['<input type="checkbox">', 'change', function (instance, toast, input, e) {
                    console.info(input.checked);
                }],
                ['<span style="padding-left:20px;padding-right:20px;color:white">' + x + ' items</span>', function (instance, toast) {
                    instance.hide({ transitinoOut: 'fadeOut' }, toast, 'button');
                }, true],
                ['<button style="background: #FFFFFF;border-radius: 12px;color: #7573B6;width: 119px;height: 46px;">Pay now</button>', 'click', function (instance, toast, input, e) {
                    BatchPayNow();
                }, true],
                ['<a style="padding-left:20px;padding-right:40px;color:white"><i class="icons8-black-waste"></i> Delete</a>', 'click', function (instance, toast, input, e) {
                    BatchDelete();
                }],
                ['<a style="color:white">Cancel</a>', 'click', function (instance, toast, input, e) {
                    instance.hide({ transitinoOut: 'fadeOut' }, toast, 'button');
                }],
            ]
        });
    }
    function CountBills() {
        ajax.formAction = "/Transaction/Bills/GetBillerList";
        ajax.jsonData = {};
        ajax.sendData().then(function () {
            if (ajax.responseData) {
                $(".HaveBillData").show();
                $(".NoBillData").hide();
            } else {
                $(".NoBillData").show();
                $(".HaveBillData").hide();
            }
        });
    }
})();