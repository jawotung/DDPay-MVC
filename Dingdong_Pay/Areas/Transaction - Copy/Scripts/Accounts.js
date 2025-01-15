"use strict";
(function () {
    var ajax = $D();
    var tblTransaction = "";
    var AccountID = 0;
    $(document).ready(function () {
        drawDatatables();
        GetAccountList();

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
        $('#Currency').select2({
            ajax: {
                url: "/Select2/GetSelect2Data",
                data: function (params) {
                    return {
                        q: params.term,
                        id: 'ID',
                        text: "Value",
                        table: 'mGeneral',
                        db: 'Dingdong_Pay',
                        condition: ' AND TypeID = 4',
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
            $("#btnDelete").css("display", "none");
            $("#mdlForm").modal("show");
            cancelUserForm();
        });
        $("#frmAccounts").submit(function (e) {
            e.preventDefault();
            ajax.formData = $('#frmAccounts').serializeArray();
            ajax.formAction = '/Transaction/Accounts/SaveData';
            ajax.setJsonData().sendData().then(function () {
                Reload();
            });
        });
        $("#btnSaveForm").click(function (e) {
            $("#frmAccounts").addClass('was-validated');
        });
    });
    
    function GetAccountList() {
        var HtmlEl = "";
        ajax.formAction = "/Transaction/Accounts/GetAccountList";
        ajax.jsonData = {};
        ajax.sendData().then(function () {
            $("#divAccount").html(HtmlEl);
            $.each(ajax.responseData, function (k, v) {
                HtmlEl += '<div class="transaction-item CursorPointer" ' +
                                'data-ID ="' + v.ID + '"' +
                                'data-Amount ="' + DecimalFormat(v.Amount) + '"' +
                                'data-Account ="' + v.Account + '"' +
                                'data-DisplayName ="' + v.DisplayName + '"' +
                            '>' +
                                '<div class="media">' +
                                    '<div class="avatar bg-light-info rounded">' +
                                        '<div class="avatar-content">' +
                                            '<i class="avatar-icon font-medium-3"></i>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="media-body">' +
                                        '<h6 class="transaction-title">' + v.DisplayName + '</h6>' +
                                        '<small>' + v.TypesName + ' > ' + v.Account + '</small>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="font-weight-bolder text-success">' + DecimalFormat(v.Amount) + '</div>' +
                            '</div>';
            });
            $("#divAccount").html(HtmlEl);

            $(".CursorPointer").off("click");
            $(".CursorPointer").click(function () {
                AccountID = $(this).attr("data-ID");
                $("#TitleTransaction").text($(this).attr("data-DisplayName"));
                $("#DetailsTransaction").text($(this).attr("data-Account"));
                $("#AmountTransaction").text($(this).attr("data-Amount"));
                tblTransaction.ajax.reload(null, false);
            });
        });
    }
    function drawDatatables() {
        if (!$.fn.DataTable.isDataTable('#tblTransaction')) {
            tblTransaction = $('#tblTransaction').DataTable({
                processing: true,
                serverSide: true,
                "order": [[0, "asc"]],
                "scrollY": "300px",
                "pageLength": 25,
                "ajax": {
                    "url": "/Transaction/Accounts/GetTransactionList",
                    "type": "POST",
                    "datatype": "json",
                    "data": function (d) {
                        d.Account = AccountID;
                    }
                },
                responsive: true,
                dataSrc: "data",
                columns: [
                    { title: "Transaction", data: "Transaction" },
                    { title: "Finances", data: "ExpensesName" },
                    { title: "Date", data: "InputDate", name: "FullDate"  },
                    {
                        title: "Amount", data: "TotalAmount", render: function (data) {
                            return DecimalFormat(data);
                        }
                    },

                ],
                "createdRow": function (row, data, dataIndex) {
                    $(row).attr('data-id', data.ID);
                },
                "initComplete": function () {
                },
            })
        }
    }
    function cancelUserForm() {
        ajax.clearFromData("frmAccounts");
    }
    function Reload() {
        cancelUserForm();
        GetAccountList();
        tblTransaction.ajax.reload(null, false);
        $("#mdlForm").modal("hide");
    }
})();
