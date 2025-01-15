"use strict";
(function () {
    var ajax = $D();
    $(document).ready(function () {
        GetBudgetList();
        GetExpenseList();

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
        $("#BreakdownYear").change(function () {
            $("#Breakdown").val("");
            if ($(this).is(":checked"))
                $("#divBreakdown").css("display", "block");
            else
                $("#divBreakdown").css("display", "none");
        });
        $("#btnAdd").click(function () {
            $("#mdlBudget").modal("show");
        });
        $("#btnAddExpense").click(function () {
            $("#mdlExpense").modal("show");
        });
        $("#btnEdit").click(function () {
            $("#divCatergoryFrm").css("display", "none");
            $("#Expenses").attr('required', false);
            $("#mdlForm").modal("show");
        });
        $("#frmBudget").submit(function (e) {
            e.preventDefault();
            ajax.formData = $('#frmBudget').serializeArray();
            ajax.formAction = '/Transaction/Budget/SaveBudget';
            ajax.setJsonData().sendData().then(function () {
                Reload();
            });
        });
        $("#frmExpense").submit(function (e) {
            e.preventDefault();
            ajax.formData = $('#frmExpense').serializeArray();
            ajax.formAction = '/Transaction/Budget/SaveExpense';
            ajax.setJsonData().sendData().then(function () {
                Reload();
            });
        });
    });

    function GetBudgetList() {
        ajax.formAction = "/Transaction/Budget/GetBudgetList";
        ajax.jsonData = {};
        ajax.sendData().then(function () {
            DisplayBudget(ajax.responseData);
        });
    }
    function GetExpenseList() {
        ajax.formAction = "/Transaction/Budget/GetExpenseList";
        ajax.jsonData = {};
        ajax.sendData().then(function () {
            DisplayExpense(ajax.responseData);
        });
    }
    function DisplayBudget(data) {
        var elHtml = ""
        $.each(data, function (k, v) {
        elHtml += 
                        "<div class='card divBudget' style='grid-template-columns:none' data-list='" + JSON.stringify(v) + "'>" ;
         elHtml += 
                            '<div class="card-body" style="border: 0px;"> ' +
                                '<div class="item-name"> ' +
                                    '<h6 class="mb-0"> ' +
                                        '<label class="text-body" style="font-size:20px;color:black;font-weight:bold;padding-right:50px">' + v.StartDate + ' - ' + v.EndDate + '</label> ' +
                                        '<button type="button" class="btn btn-icon btn-flat-primary  waves-effect btnEditBudget"><i class="icons8-black-edit"></i></button> ' +
                                    '</h6> ' +
                                    '<div class="row"> ' +
                                        '<div class="col-6"> ' +
                                            '<span class="delivery-date contentSecondary">Budget: P ' + v.Amount + '</span> ' +
                                        '</div> ' +
                                        '<div class="col-6 text-right"> ' +
                                            '<span class="delivery-date text-muted">Spent: P ' + v.Spend + '</span> ' +
                                        '</div> ' +
                                    '</div> ' +
                                    '<div class="row" style="padding-bottom:40px"> ' +
                                        '<div class="col-6 offset-6 text-right"> ' +
                                            '<span class="delivery-date text-muted">Left: P ' + (parseFloat(v.Amount) - parseFloat(v.Spend)) + '</span> ' +
                                        '</div> ' +
                                        '<br> ' +
                                    '</div> ' +
                                '</div> ' +
                                '<div class="progress-wrapper"> ' +
                                    '<div class="progress progress-bar-primary"> ' +
                                        '<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="0" style="width: 100%" aria-describedby="example-caption-5"></div> ' +
                                    '</div> ' +
                                '</div> ' +
                            '</div> ' +
                        '</div> ';
        });
        $("#divBudgetList").html(elHtml);

        $('.btnEditBudget').off('click')
        $('.btnEditBudget').on('click', function (e) {
            EditBudget($($(this)[0].parentElement.parentElement.parentElement.parentElement).data("list"));
        });
    }
    function DisplayExpense(data) {
        var elHtml = ""
        $.each(data, function (k, v) {
        elHtml += 
                        "<div class='card' style='grid-template-columns:none' data-list='" + JSON.stringify(v) + "'>" ;
         elHtml +=          '<div class="card-body" style="border: 0px;"> ' + 
                                '<div class="row"> ' + 
                                    '<div class="col-3"> ' + 
                                        '<div style="width: 75px; height: 75px; background: #EAE9F7; border-radius: 100px; margin: 0px 24px;"> ' + 
                                            '<img src=".../../../Areas/Master/Upload/Img/ExpenseType/' + v.ExpenseTypeID + '.png" style="width: 75px; height: 75px; background: #EAE9F7; border-radius:100px;"> ' + 
                                        '</div> ' + 
                                    '</div> ' + 
                                    '<div class="col-9"> ' + 
                                        '<h6 class="mb-0"> ' + 
                                            '<label class="text-body" style="font-size:20px;color:black;font-weight:bold;padding-right:50px">' + v.ExpenseType + '</label> ' + 
                                            '<button type="button" class="btn btn-icon btn-flat-primary  waves-effect btnEditExpense"><i class="icons8-black-edit"></i></button> ' + 
                                        '</h6> ' + 
                                        '<div class="row"> ' + 
                                            '<div class="col-6"> ' + 
                                                '<span class="delivery-date contentSecondary">Budget: P' + DecimalFormat(v.ExpenseAmount) + '</span> ' + 
                                            '</div> ' + 
                                            '<div class="col-6 text-right"> ' + 
                                                '<span class="delivery-date text-muted">Spent: P ' + DecimalFormat(v.SpendAmount) + '</span> ' + 
                                            '</div> ' + 
                                        '</div> ' + 
                                        '<div class="row" style="padding-bottom:40px"> ' + 
                                            '<div class="col-6 offset-6 text-right"> ' + 
                                                '<span class="delivery-date text-muted">Left: P ' + DecimalFormat(parseFloat(v.ExpenseAmount) - parseFloat(v.SpendAmount)) + '</span> ' + 
                                            '</div> ' + 
                                            '<br> ' + 
                                        '</div> ' + 
                                    '</div> ' + 
                                '</div> ' + 
                                '<div class="progress-wrapper"> ' + 
                                    '<div class="progress progress-bar-primary"> ' + 
                                        '<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="0" style="width: 100%" aria-describedby="example-caption-5"></div> ' + 
                                    '</div> ' + 
                                '</div> ' + 
                            '</div> ' + 
                        '</div> ' ;
        });
        $("#divExpenseList").html(elHtml);
        $('.btnEditExpense').off('click')
        $('.btnEditExpense').on('click', function (e) {
            EditExpense($($(this)[0].parentElement.parentElement.parentElement.parentElement).data("list"));
        });
    }
    function EditBudget(x) {
        $("#frmBudget").parsley().reset();
        ajax.populateToFormInputs(x, "#frmBudget");
        $("#BreakdownYear").trigger("change");
        $("#mdlBudget").modal("show");
    }
    function EditExpense(x) {
        $("#frmExpense").parsley().reset();
        ajax.populateToFormInputs(x, "#frmExpense");
        var ExpensesOp = new Option(x.ExpenseType, x.ExpenseTypeID, true, true);
        $('#ExpenseType').append(ExpensesOp).trigger('change');
        $("#mdlExpense").modal("show");
    }
    function Reload() {
        $("#mdlBudget").modal("hide");
        $("#mdlExpense").modal("hide");
        ajax.clearFromData("frmExpense");
        ajax.clearFromData("frmBudget");
    }

})();
