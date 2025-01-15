"use strict";
(function () {
    var ajax = $D();
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date();
    var $trackBgColor = '#e9ecef';
    $(document).ready(function () {
        $("#Month").text(month[d.getMonth()]);
        $("#Year").text(d.getFullYear());
        GetMonthlyList();
        GetCategoryList();

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
            if ($(".tab-pane.active").attr("id") == "montlhy-tab") {
                $("#divCatergoryFrm").css("display", "none");
                $("#Expenses").attr('required', false);
            }
            else {
                $("#divCatergoryFrm").css("display", "block");
                $("#Expenses").attr('required', true);
            }
            cancelUserForm();
            $("#mdlForm").modal("show");
        });
        $("#btnEdit").click(function () {
            $("#divCatergoryFrm").css("display", "none");
            $("#Expenses").attr('required', false);
            $("#mdlForm").modal("show");
        });
        $("#frmBudget").submit(function (e) {
            e.preventDefault();
            ajax.formData = $('#frmBudget').serializeArray();
            ajax.formAction = '/Transaction/Budget/SaveData';
            ajax.setJsonData().sendData().then(function () {
                Reload();
            });
        });
        $("#btnSaveForm").click(function (e) {
            $("#frmBudget").addClass('was-validated');
        });
        $('#btnDelete').click(function () {
            ajax.msg = "Are you sure you want to delete this data?";
            ajax.confirmAction().then(function (approve) {
                if (approve) {
                    ajax.formAction = '/Transaction/Budget/DeleteData';
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
        ajax.formAction = "/Transaction/Budget/GetMonthlyList";
        ajax.jsonData = { Year: $("#Year").text() };
        ajax.sendData().then(function () {
            var data = ajax.responseData
            $("#divMonthly").html(HtmlEl);
            $.each(data, function (k, v) {
                HtmlEl +='<div class="browser-states CursorPointer" ' +
                                'data-ID ="' + v.ID + '"' +
                                'data-ExpensesAmount ="' + DecimalFormat(v.ExpensesAmount) + '"' +
                                'data-Percentage ="' + v.Percentage + '"' +
                                'data-Remaining ="' + DecimalFormat(v.Remaining) + '"' +
                                'data-TotalAmount ="' + DecimalFormat(v.TotalAmount) + '"' +
                                'data-Month ="' + v.Month + '"' +
                                'data-ExpensesName ="' + v.ExpensesName + '"' +
                                'data-InputDate ="' + v.InputDate + '"' +
                                'data-FormStatus ="1"' +
                            '>' +
                           '<div class="media">' +
                               '<div class="avatar bg-light-info rounded"> ' +
                                   '<div class="avatar-content"> ' +
                                        '<i class="avatar-icon font-medium-3"></i> ' +
                                   '</div> ' +
                               '</div> ' +
                               '<div class="media-body" style="margin-left: 10px;"> ' +
                                    '<h6 class="transaction-title"> ' + v.Month + '</h6> ' +
                                    '<small>Spent: ₱' + DecimalFormat(v.ExpensesAmount) + ' › ' + v.Percentage + '%; Remaining: ' + DecimalFormat(v.Remaining) + '</small>' +
                               '</div> ' +
                           '</div> ' +
                           '<div class="d-flex align-items-center"> ' +
                                '<div class="font-weight-bold text-body-heading mr-1">' + DecimalFormat(v.TotalAmount) + '</div> ' +
                                '<div id="chart-' + v.Month + '"></div> ' +
                           '</div> ' +
                       '</div> ';
            });
            $("#divMonthly").html(HtmlEl);
            $.each(data, function (k, v) {
                LoadCharts("#chart-" + v.Month, [v.Percentage]);
            });
            DetailsEvent();
        });
    }
    function GetCategoryList() {
        var HtmlEl = "";
        ajax.formAction = "/Transaction/Budget/GetCategoryList";
        ajax.jsonData = { Year: $("#Year").text(), Month: $("#Month").text() };
        ajax.sendData().then(function () {
             var data = ajax.responseData
            $("#divCategory").html(HtmlEl);
            $.each(data, function (k, v) {
                HtmlEl +='<div class="browser-states CursorPointer" ' +
                                'data-ID ="' + v.ID + '"' +
                                'data-ExpensesAmount ="' + DecimalFormat(v.ExpensesAmount) + '"' +
                                'data-Percentage ="' + v.Percentage + '"' +
                                'data-Remaining ="' + DecimalFormat(v.Remaining) + '"' +
                                'data-TotalAmount ="' + DecimalFormat(v.TotalAmount) + '"' +
                                'data-Month ="' + v.Month + '"' +
                                'data-ExpensesName ="' + v.ExpensesName + '"' +
                                'data-Expenses ="' + v.Expenses + '"' +
                                'data-InputDate ="' + v.InputDate + '"' +
                                'data-FormStatus ="0"' +
                            '>' +
                           '<div class="media">' +
                               '<div class="avatar bg-light-info rounded"> ' +
                                   '<div class="avatar-content"> ' +
                                        '<i class="avatar-icon font-medium-3"></i> ' +
                                   '</div> ' +
                               '</div> ' +
                               '<div class="media-body" style="margin-left: 10px;"> ' +
                                    '<h6 class="transaction-title"> ' + v.ExpensesName + '</h6> ' +
                                    '<small>Spent: ₱' + DecimalFormat(v.ExpensesAmount) + ' › ' + v.Percentage + '%; Remaining: ' + DecimalFormat(v.Remaining) + '</small>' +
                               '</div> ' +
                           '</div> ' +
                           '<div class="d-flex align-items-center"> ' +
                                '<div class="font-weight-bold text-body-heading mr-1">' + DecimalFormat(v.TotalAmount) + '</div> ' +
                                '<div id="chart-' + v.ExpensesName + '"></div> ' +
                           '</div> ' +
                       '</div> ';
            });
            $("#divCategory").html(HtmlEl);
            $.each(data, function (k, v) {
                LoadCharts("#chart-" + v.ExpensesName, [v.Percentage]);
            });
            DetailsEvent();
        });
    }
    function LoadCharts(htmlel, data) {
        var ChartEl = document.querySelector(htmlel);
        var statePrimaryChartOptions = {
            chart: {
                id: htmlel,
                height: 30,
                width: 30,
                type: 'radialBar'
            },
            grid: {
                show: false,
                padding: {
                    left: -15,
                    right: -15,
                    top: -12,
                    bottom: -15
                }
            },
            colors: [window.colors.solid.primary],
            series: data, //[54.4],
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '22%'
                    },
                    track: {
                        background: $trackBgColor
                    },
                    dataLabels: {
                        showOn: 'always',
                        name: {
                            show: false
                        },
                        value: {
                            show: false
                        }
                    }
                }
            },
            stroke: {
                lineCap: 'round'
            }
        };
        var statePrimaryChart = new ApexCharts(ChartEl, statePrimaryChartOptions);
        statePrimaryChart.render();
    }
    function DetailsEvent() {
        $(".CursorPointer").off("click");
        $(".CursorPointer").click(function () {
            $("#ID").val($(this).attr("data-ID"));
            if ($(this).attr("data-FormStatus") == "1") {
                $("#TitleDetail").text($(this).attr("data-Month"));
                $('#Expenses').val(null).trigger('change');
            }
            else {
                $("#TitleDetail").text($(this).attr("data-ExpensesName"));
                var ExpensesOp = new Option($(this).attr("data-ExpensesName"), $(this).attr("data-Expenses"), true, true);
                $('#Expenses').append(ExpensesOp).trigger('change');
            }
            $("#BudgetDetail").text($(this).attr("data-TotalAmount"));
            $("#ExpenseDetail").text($(this).attr("data-ExpensesAmount"));
            $("#RemainingDetail").text($(this).attr("data-Remaining"));
            $("#divDetail").css("display", "block");

            $("#Amount").val(DecimalFormat($(this).attr("data-TotalAmount").replace(/,/g, '')));
            $("#InputDate").val($(this).attr("data-InputDate"));
        });
    }
    function cancelUserForm() {
        ajax.clearFromData("frmBudget");
    }
    function Reload() {
        cancelUserForm();
        GetMonthlyList();
        GetCategoryList();
        $("#divDetail").css("display", "none");
        $("#mdlForm").modal("hide");
    }
})();
