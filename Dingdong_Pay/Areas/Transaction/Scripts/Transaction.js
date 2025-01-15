"use strict";
(function () {
    var ajax = $D();
    var tblAll = "";
    var DataSelected;
    $(document).ready(function () {
        //CountTransaction();
        GetTransactionList();

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
        
        $("#btnAdd").click(function () {
            cancelUserForm();
            AddTransaction();
        });
        $("#RecurringOptions").change(function () {
            $(".txtRecurring").val("");
            if ($(this).is(":checked")) {
                $(".Recurring").show();
            } else {
                $(".Recurring").hide();
            }
        });

        $("#btnSave").click(function (e) {
            $("#frmTransaction").addClass('was-validated');
        });

        $("#btnSDEdit").click(function (e) {
            EditTransaction(DataSelected);
        });
        $("#btnSDDelete").click(function (e) {
            DeleteTransaction([DataSelected.ID]);
        });
        
        $("#frmTransaction").submit(function (e) {
            e.preventDefault();
            var formData = new FormData(this);
            if ($('#Document')[0].files.length != 0) {
                formData.append("Document", $('#Document')[0].files[0]);
            }
            formData.append("RecurringOptions", ($('#RecurringOptions').is(":checked") ? 1 : 0));
            formData.append("ReminderOptions", ($('#ReminderOptions').is(":checked")? 1 : 0));
            ajax.jsonData = formData;
            ajax.formAction = '/Transaction/Transaction/SaveData';
            ajax.sendFile().then(function () {
                $("#mdlTransaction").modal("hide");
                cancelUserForm();
            });
        });
    });

    function PopulateSD(x) {
        DataSelected = x;
        $("#sdExpenseType").text(x.ExpenseType);
        $("#sdNote").text(x.Note);
        $("#sdDocument").text(x.Document);
        $("#sdTransactionDate").text(x.TransactionDate);
        $("#sdAmount").text(DecimalFormat(x.Amount));
        $("#sdFrequency").text(x.Frequency);
        $("#sdStartDate").text(x.StartDate);
        $("#sdEndDate").text(x.EndDate);
    }
    function AddTransaction() {
        $("#btnSave").text("Add");
        $('#RecurringOptions')[0].checked = false;
        $("#mdlTransaction").modal("show");
    }
    function cancelUserForm() {
        GetTransactionList();
        $("#btnSave").text("Save");
        $("#frmTransaction").parsley().reset();
        ajax.clearFromData("frmTransaction");
        $(".Recurring").css("display", "none");
        $("#mdlTransaction").modal("hide");
    }
    function GetTransactionList() {
        ajax.formAction = "/Transaction/Transaction/GetTransactionList";
        ajax.jsonData = { };
        ajax.sendData().then(function () {
            DisplayTransaction(ajax.responseData);
        });
    }
    function DisplayTransaction(x) {
        var elHtml = "";
        $("#divTransactionList").html("");
        $.each(x, function (k, v) {
            if (k == 0)
                PopulateSD(v);
            elHtml += "<div class='card ecommerce-card DivTransaction' data-list='" + JSON.stringify(v) + "'>";
            elHtml +=    '<div class="item-img">' +
                            '<div class="row" style="height:100%">' +
                                '<div class="col-12" style="padding-top: 20px;">' +
                                    '<div style="width: 75px; height: 75px; background: #EAE9F7; border-radius: 100px; margin: 0px 24px;">' +
                                        '<img src=".../../../Areas/Master/Upload/Img/ExpenseType/' + v.ExpenseTypeID + '.png" style="width: 75px; height: 75px; background: #EAE9F7; border-radius: 100px;" />' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>                           ' +
                        '<div class="card-body" style="border: 0px;">' +
                            '<div class="item-name">' +
                                '<h6 class="mb-0">' +
                                    '<label class="text-body" style="font-size:20px;color:black;font-weight:bold;padding-right:50px">' + v.ExpenseType + '</label>' +
                                    '<button type="button" class="btn btn-icon btn-flat-primary  waves-effect btnEdit"><i class="icons8-black-edit"></i></button> ' +
                                '</h6>' +
                                '<span class="delivery-date text-muted" style="line-height:30px">' + v.ExpenseType + '</span>' +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="item-options text-center">' +
                            '<div class="item-wrapper" style="height:100%">' +
                                '<div class="item-cost">' +                                
                                '<h6 class="mb-0">' +
                                    '<label class="text-body" style="font-size:20px;color:' + (parseInt(v.Amount) < 0 ? "red" : "black") + ';font-weight:bold;">P ' + DecimalFormat(v.Amount) + '</label>' +
                                '</h6>' +
                                    '<span class="delivery-date" style="color:#979597">' + v.TransactionDateName + '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        });
        $("#divTransactionList").html(elHtml);
        TransactionEvent();
    }
    function TransactionEvent() {
        $('.DivTransaction').off('click')
        $('.DivTransaction').on('click', function (e) {
            PopulateSD($(this).data("list"));
        });

        $('.btnEdit').off('click')
        $('.btnEdit').on('click', function (e) {
            EditTransaction($($(this)[0].parentElement.parentElement.parentElement.parentElement).data("list"));
        });
        
    }
    function EditTransaction(x) {
        DataSelected = x;
        cancelUserForm();
        $('#RecurringOptions').attr('checked', (x.RecurringOptions == 1 ? true : false)).change();
        ajax.populateToFormInputs(x, "#frmTransaction");
        var ExpensesOp = new Option(x.ExpenseType, x.ExpenseTypeID, true, true);
        $('#ExpenseType').append(ExpensesOp).trigger('change');
        $("#btnSave").text("Save");
        $("#mdlTransaction").modal("show");
    }
    function DeleteTransaction() {
        var mTitle = "Delete data";
        var msg = "Are you sure you want to delete. You will not be able to undo the action once deleted."
        ajax.DeleteConfirm(mTitle, msg).then(function (approve) {
            if (approve) {
                ajax.formAction = '/Transaction/Transaction/DeleteData';
                ajax.jsonData = { ID: x };
                ajax.sendData().then(function () {
                    cancelUserForm();
                });
            }
        });
    }
    function CountTransaction() {
        ajax.formAction = "/Transaction/Transaction/GetTransactionerList";
        ajax.jsonData = {};
        ajax.sendData().then(function () {
            if (ajax.responseData) {
                $(".HaveTransactionData").show();
                $(".NoTransactionData").hide();
            } else {
                $(".NoTransactionData").show();
                $(".HaveTransactionData").hide();
            }
        });
    }
})();