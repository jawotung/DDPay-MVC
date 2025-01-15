"use strict";
(function () {
    var ajax = $D();
    var tblAll = "";
    var DataSelected;
    var Status = 10;
    var isManual = false;
    $(document).ready(function () {
        CountBills();
        drawDatatables();
        GetBillerList();
       
        $(".tabsStatus").click(function () {
            Status = $(this).attr("data-status");
            tblAll.ajax.reload(false); 
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
        $('#tblAll tbody').on('click', 'tr', function (e) {
            if (e.target.localName == "td") {
                var x = tblAll.row($(this)).data();
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

        });
        $("#tblAll").on("click", ".btnEdit", function () {
            var x = tblAll.row($(this).parents('tr')).data();
            EditBill(x);
        });
        $("#tblAll").on("click", ".btnMarkAsPaid", function () {
            var x = tblAll.row($(this).parents('tr')).data();
            ShowMarkAsPaid(x.ID);
        });
        $("#tblAll").on("change", ".CheckItem", function () {
            var data = [];
            tblAll.rows().every(function (index, element) {
                var row = $(this.node());
                if (row.find('.CheckItem').is(":checked")) {
                    data.push(tblAll.row(this).data());
                }
            });
            iziToast.destroy();
            if (data.length != 0)
                ToastShow(data.length);
        });
        $("#tblAll").on("click", ".btnPayNow", function () {
            var x = tblAll.row($(this).parents('tr')).data();
            PayNowDetails([x]);
        });


    });

    function drawDatatables() {
        if (!$.fn.DataTable.isDataTable('#tblAll')) {
            tblAll = $('#tblAll').DataTable({
                searching: false,
                lengthChange: false,
                processing: true,
                serverSide: true,
                "order": [[2, "desc"], [5, "desc"]],
                "pageLength": 25,
                "ajax": {
                    "url": "/Transaction/Bills/GetBillsList",
                    "type": "POST",
                    "datatype": "json",
                    "data": function (d) {
                        d["Status"] = Status
                    }
                },
                dataSrc: "data",
                columns: [
                    {
                        title: '<input type="checkbox" id="Checked" class="CheckAllitem" />', data: function (data) {
                            if (data.isPaid == 0)
                                return '<input type="checkbox" class="CheckItem" />';
                            else
                                return "";
                        }, sortable: false, orderable: false, width: "5%"
                    },
                    { title: "", data: 'DueMonth',visible:false},
                    { title: "", data: 'GroupMonth', visible: false},    
                    { title: "BILLER", data: 'Biller' },
                    { title: "BILL TITLE", data: 'BillTitle' },
                    { title: "DUE DATE", data: 'DueDate' },
                    {
                        title: "STATUS", data: 'Status', render: function (data) {
                            return GetStatus(data);
                        },
                    },
                    {
                        title: "AMOUNT", data: 'Amount', render: function (data) {
                            return DecimalFormat(data);
                        },
                    },
                    {
                        title: "", data: function (data) {
                            var PaidIcon = "icons8-black-in-progress";
                            if (data.isPaid == 1)
                                var PaidIcon = "icons8-black-ok";
                            return '<button type="button" class="btn btn-icon btn-flat-primary  waves-effect btnPayNow" ' + (data.isPaid == 1 ? "disabled" : "") + '>PAY NOW</button> ' +
                                   '<button type="button" class="btn btn-icon btn-flat-primary  waves-effect btnEdit"><i class="icons8-black-edit"></i></button> ' +
                                   '<button type="button" class="btn btn-icon btn-flat-success  waves-effect btnMarkAsPaid" ' + (data.isPaid == 1 ? "disabled" : "") + '> <i class="' + PaidIcon + '"></i></button>';
                        }, sortable: false, orderable: false
                    },
                ],
                "rowCallback": function (row, data) {
                    if(data.Status == 1)
                        $($(row)[0].children[5]).addClass("text-danger");
                 },
                "drawCallback": function (settings) {
                    checkAllCheckboxesInTable("#tblAll", ".CheckAllitem", ".CheckItem");
                    var api = this.api();
                    var rows = api.rows({ page: 'current' }).nodes();
                    var last = null;

                    api.column(1, { page: 'current' }).data().each(function (group, i) {
                        if (last !== group) {
                            $(rows).eq(i).before(
                                '<tr class="group"><td><input type="checkbox" class="CheckItem" /></td>' +
                                '<td colspan="7"><b>' + group + '</b></td></tr>'
                            );

                            last = group;
                        }
                    });
                    DisplayBiller(tblAll.rows().data());
                },
            })
        }
    }
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
        tblAll.ajax.reload(false);
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
    function EditBill(x) {
        ShowAllForm();
        $("#frmBill").parsley().reset();
        $('#RecurringOptions').attr('checked', (x.RecurringOptions == 1 ? true : false)).change();
        $('#ReminderOptions').attr('checked', (x.ReminderOptions == 1 ? true : false)).change();
        $('#LinkBiller').attr('checked', false).change();
        ajax.populateToFormInputs(x, "#frmBill");
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
    function ShowMarkAsPaid(ID) {
        $("#mdlView").modal("hide");
        $("#MarkAsPaidID").val(ID);
        $("#mdlMarkAsPaid").modal("show");
    }
    function BatchDelete() {
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
    }
    function BatchPayNow() {
        var data = [];
        tblAll.rows().every(function (index, element) {
            var row = $(this.node());
            if (row.find('.CheckItem').is(":checked")) {
                data.push(tblAll.row(this).data());
            }
        });
        if (data.length != 0)
            PayNowDetails(data);
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