"use strict";
(function () {
    var ajax = $D();
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date();
    $(document).ready(function () {
        $("#Month").text(month[d.getMonth()]);
        $("#Year").text(d.getFullYear());
        GetMonthlyList();
        GetDailyList();

        $(".navYear").click(function (e) {
            var Year = parseInt($("#Year").text());
            if ($(this).attr("data-action") == "next")
                Year++;
            else
                Year--;
            $("#Year").text(Year);
            Reload();
        });
        $(".navMonth").click(function (e) {
            var Year = parseInt($("#Year").text());
            var Month = month.indexOf($("#Month").text());

            if ($(this).attr("data-action") == "next")
                Month++;
            else
                Month--;

            if ($(this).attr("data-action") == "next" && Month == 12) {
                Year++;
                Month = 0;
            }
            else if ($(this).attr("data-action") == "previous" && Month == -1) {
                Year--;
                Month = 11;
            }

            $("#Year").text(Year);
            $("#Month").text(month[Month]);
            Reload();
        });

        $('#Expenses').select2({
            ajax: {
                url: "/Select2/GetSelect2Data",
                data: function (params) {
                    return {
                        q: params.term,
                        id: 'ID',
                        text: "Value",
                        table: 'mGeneral',
                        db: 'Dingdong_Pay',
                        condition: ' AND TypeID = 5',
                        display: 'id&text',
                        orderBy: ' ORDER BY Value '
                    };
                },
            },
            placeholder: '--Please Select--',
            width: 'auto',
            theme: 'bootstrap4'
        });
        $('#Account').select2({
            ajax: {
                url: "/Select2/GetSelect2Data",
                data: function (params) {
                    return {
                        q: params.term,
                        id: 'ID',
                        text: "CONCAT(TypesName,'>',Account)",
                        table: 'vAccount',
                        db: 'Dingdong_Pay',
                        condition: '',
                        display: 'id&text',
                        orderBy: ' ORDER BY TypesName '
                    };
                },
            },
            placeholder: '--Please Select--',
            width: 'auto',
            theme: 'bootstrap4'
        });

        $("#btnAdd").click(function () {
            $("#btnDelete").css("display", "none");
            $("#mdlForm").modal("show");
            cancelUserForm();
        });
        $("#frmIncome").submit(function (e) {
            e.preventDefault();
            ajax.formData = $('#frmIncome').serializeArray();
            ajax.formAction = '/Transaction/Income/SaveData';
            ajax.setJsonData().sendData().then(function () {
                Reload();
            });
        });
        $("#btnSaveForm").click(function (e) {
            $("#frmIncome").addClass('was-validated');
        });
        $('#btnDelete').click(function () {
            ajax.msg = "Are you sure you want to delete this data?";
            ajax.confirmAction().then(function (approve) {
                if (approve) {
                    ajax.formAction = '/Transaction/Income/DeleteData';
                    ajax.jsonData = { ID: $("#ID").val() };
                    ajax.sendData().then(function () {
                        Reload();
                    });
                }
            });
        });
    });

    function GetMonthlyList() {
        var HtmlEl = "";
        ajax.formAction = "/Transaction/Income/GetMonthlyList";
        ajax.jsonData = { Year: $("#Year").text() };
        ajax.sendData().then(function () {
            $("#divMonthly").html(HtmlEl);
            $.each(ajax.responseData, function (k, v) {
                HtmlEl += '<div class="transaction-item">' +
                                '<div class="media">' +
                                    '<div class="avatar bg-light-info rounded">' +
                                        '<div class="avatar-content">' +
                                            '<i class="avatar-icon font-medium-3"></i>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="media-body">' +
                                        '<h6 class="transaction-title">' + v.Month + '</h6>' +
                                        '<small>' + v.TotalTransaction + ' Transaction</small>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="font-weight-bolder text-success">' + DecimalFormat(v.TotalAmount) + '</div>' +
                            '</div>';
            });
            $("#divMonthly").html(HtmlEl);
        });
    }
    function GetDailyList() {
        var HtmlEl = "";
        ajax.formAction = "/Transaction/Income/GetDailyList";
        ajax.jsonData = { Year: $("#Year").text(), Month: $("#Month").text() };
        ajax.sendData().then(function () {
            $("#divDaily").html(HtmlEl);
            $.each(ajax.responseData, function (k, v) {
                HtmlEl += '<div class="transaction-item btnDaily CursorPointer" ' +
                                'data-FullDate ="' + v.FullDate + '"' +
                            '>' +
                                '<div class="media">' +
                                    '<div class="avatar bg-light-info rounded">' +
                                        '<div class="avatar-content">' +
                                            '<i class="avatar-icon font-medium-3"></i>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="media-body">' +
                                        '<h6 class="transaction-title">' + v.InputDate + '</h6>' +
                                        '<small>' + v.ExpensesName + '</small>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="font-weight-bolder text-success">' + DecimalFormat(v.TotalAmount) + '</div>' +
                            '</div>';
            });
            $("#divDaily").html(HtmlEl);

            $(".btnDaily").off("click");
            $(".btnDaily").click(function () {
                GetDetailList($(this).attr("data-FullDate"));
            });
        });
    }
    function GetDetailList(InputDate) {
        var HtmlEl = "";
        ajax.formAction = "/Transaction/Income/GetDetailList";
        ajax.jsonData = { InputDate: InputDate };
        ajax.sendData().then(function () {
            $("#divDetail").html(HtmlEl);
            $.each(ajax.responseData, function (k, v) {
                HtmlEl += '<div class="transaction-item btnDetails CursorPointer" ' +
                                'data-ID ="' + v.ID + '"' +
                                'data-Expenses ="' + v.Expenses + '"' +
                                'data-ExpensesName ="' + v.ExpensesName + '"' +
                                'data-ExpensesChild ="' + v.ExpensesChild + '"' +
                                'data-Account ="' + v.Account + '"' +
                                'data-AccountName ="' + v.AccountName + '"' +
                                'data-Amount ="' + v.Amount + '"' +
                                'data-InputDate ="' + v.InputDate + '"' +
                                'data-Repeat ="' + v.Repeat + '"' +
                                'data-Notes ="' + v.Notes + '"' +
                            '>' +
                                '<div class="media">' +
                                    '<div class="avatar bg-light-info rounded">' +
                                        '<div class="avatar-content">' +
                                            '<i class="avatar-icon font-medium-3"></i>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="media-body">' +
                                        '<h6 class="transaction-title">' + v.ExpensesName + '</h6>' +
                                        '<small>' + v.Notes + '</small>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="font-weight-bolder text-success">' + DecimalFormat(v.Amount) + '</div>' +
                            '</div>';
            });
            $("#divDetail").html(HtmlEl);

            $(".btnDetails").click(function () {
                cancelUserForm();
                $("#ID").val($(this).attr("data-ID"));
                var ExpensesOp = new Option($(this).attr("data-ExpensesName"), $(this).attr("data-Expenses"), true, true);
                var AccountOp = new Option($(this).attr("data-AccountName"), $(this).attr("data-Account"), true, true);
                $('#Expenses').append(ExpensesOp).trigger('change');
                $('#Account').append(AccountOp).trigger('change');
                $("#ExpensesChild").val($(this).attr("data-ExpensesChild"));
                $("#Amount").val(DecimalFormat($(this).attr("data-Amount")));
                $("#InputDate").val($(this).attr("data-InputDate"));
                $("#Repeat").val($(this).attr("data-Repeat"));
                $("#Notes").val($(this).attr("data-Notes"));
                $("#btnDelete").css("display", "block");
                $("#mdlForm").modal("show");
            });
        });
    }
    function cancelUserForm() {
        ajax.clearFromData("frmIncome");
    }
    function Reload() {
        cancelUserForm();
        GetMonthlyList();
        GetDailyList();
        $("#divDetail").html("");
        $("#mdlForm").modal("hide");
    }
})();
