"use strict";
(function () {
    var General = $D();
    var CUI2 = $UI();
    var tblGeneral = "";
    var tblType = "";
    var editIDGeneral = "";
    var editIDType = "";
    var addMode = false;
    $(document).ready(function () {
        CheckSession(General);
        drawDatatables();
        //General Events Here
        $('#btnNewGeneral').click(function () {
            $("#mdlGeneral").modal("show");
            $('#TypeID').prop('readonly', false);
            cancelGeneralTbl();
            cancelGeneralForm();
            tblGeneral.ajax.reload(false);
        });
        $("#frmGeneral").submit(function (e) {
            e.preventDefault();
            saveGeneral();
        });
        $('#tblGeneral tbody').on('click', 'tr', function () {
            dis_se_lectGeneralRow($(this));
        });
        $('#btnEditGeneral').click(function () {
            editGeneral();
        });
        $('#btnDeleteGeneral').click(function () {
            General.msg = "Are you sure you want to delete this data?";
            General.confirmAction().then(function (approve) {
                if (approve)
                    deleteGeneral();
            });
        });
        $("#SearchType").change(function () {
            tblGeneral.ajax.reload(false);
        });
        $(".onChangeParsley").change(function (e) {
            General.parsleyValidate("frmGeneral");
        })

        //Type Events here
        $('#btnNewType').click(function () {
            $("#mdlType").modal("show");
            $("#Type").focus();
            cancelTypeTbl();
            cancelTypeForm();
            tblType.ajax.reload(null, false);
        });
        $("#Type").change(function () {
            validateType();
        });
        $("#frmType").submit(function (e) {
            e.preventDefault();
            saveType();
        });
        $('#tblType tbody').on('click', 'tr', function () {
            dis_se_lectTypeRow($(this));
            cancelGeneralTbl();
            cancelGeneralForm();
        });
        $('#btnEditType').click(function () {
            editType();
        });
        $('#btnDeleteType').click(function () {
            General.msg = "Are you sure you want to delete this data?";
            General.confirmAction().then(function (approve) {
                if (approve)
                    deleteType();
            });
        });
        //#Special Events
        tblGeneral.on('draw.dt', function () {
            CUI.dataTableID = "#tblGeneral";
            CUI.setDatatableMaxHeight();
        });
        tblType.on('draw.dt', function () {
            CUI2.dataTableID = "#tblType";
            CUI2.setDatatableMaxHeight();
        });
        $.listen('parsley:field:error', function (fieldInstance) {//Parsley Validation Error Event Listener
            setTimeout(function () { CUI.setDatatableMaxHeight(); }, 500);
        });

        $('#btnPrintField').on('click', function (e) {
            window.location = "/Master/General/PrintField?TypeID=" + editIDType;
        });
        //Library Inits
        $('#TypeID').select2({
            ajax: {
                url: "/Select2/GetSelect2Data",
                data: function (params) {
                    return {
                        q: params.term,
                        id: 'ID',
                        text: 'Type',
                        table: 'mTypes',
                        db: 'Dingdong_Pay',
                        condition: '',
                        display: 'id&text',
                        orderBy: ' ORDER BY Type '
                    };
                },
            },
            placeholder: '--Please Select--',
            width: 'auto',
            theme: 'bootstrap4'
        });
        $('#mdlGeneral').on('shown.bs.modal', function (e) {
            if (addMode) {
                var rowData = tblType.rows({ selected: true }).data()[0];
                var typeOption = new Option(rowData.Type, rowData.ID, true, true);
                $('#TypeID').append(typeOption).trigger('change');
            }
        })


        $('.btnCommon').on('click', function (e) {
            var Name = $(this).attr("data-Name");
            var Value = $("#" + Name).val();
            General.formAction = '/Master/General/UpdateCommon';
            General.jsonData = { Name: Name, Value: Value }
            General.sendData().then(function () {
                GetCommon();
            });
        });
    });
    function drawDatatables() {
        if (!$.fn.DataTable.isDataTable('#tblGeneral')) {
            tblGeneral = $('#tblGeneral').DataTable({
                processing: true,
                serverSide: true,
                "order": [[0, "asc"]],
                "scrollY": "300px",
                "pageLength": 25,
                "ajax": {
                    "url": "/Master/General/GetGeneralList",
                    "type": "POST",
                    "datatype": "json",
                    "data": function (d) {
                        d.TypeID = editIDType;
                    }
                },
                responsive: true,
                dataSrc: "data",
                columns: [
                    { title: "Type", data: "TypeDesc" },
                    { title: "Value", data: "Value" },
                ],
                "createdRow": function (row, data, dataIndex) {
                    $(row).attr('data-id', data.ID);
                },
                "initComplete": function () {
                    //$('#tblGeneral thead').addClass('thead-dark');
                },
            })
        }
        if (!$.fn.DataTable.isDataTable('#tblType')) {
            tblType = $('#tblType').DataTable({
                processing: true,
                serverSide: true,
                "scrollY": "300px",
                "order": [[0, "asc"]],
                "pageLength": 25,
                "ajax": {
                    "url": "/Master/General/GetTypeList",
                    "type": "POST",
                    "datatype": "json",
                },
                responsive: true,
                dataSrc: "data",
                columns: [
                    { title: "Type", data: "Type" },
                ],
                "createdRow": function (row, data, dataIndex) {
                    $(row).attr('data-id', data.ID);
                },
                "initComplete": function () {
                    //$('#tblType thead').addClass('thead-dark');
                },
            })
        }
    }
    function saveGeneral() {
        General.formData = $('#frmGeneral').serializeArray();
        General.formAction = '/Master/General/SaveGeneral';
        General.setJsonData().sendData().then(function () {
            $('#TypeID').prop('readonly', false);
            tblGeneral.ajax.reload(null, false);
            cancelGeneralTbl();
            cancelGeneralForm();
        });
    }
    function cancelGeneralForm() {
        General.clearFromData("frmGeneral");
        $('#TypeID').prop('readonly', false);
        $("#btnSaveGeneral .btnLabel").text(" Save");
        $("#mdlGeneralTitle").text(" Create Value");
        addMode = false;
        $("#mdlGeneral").modal("hide");
        editIDGeneral = "";
    }
    function cancelGeneralTbl() {
        $('#btnEditGeneral').attr("disabled", "disabled");
        $('#btnDeleteGeneral').attr("disabled", "disabled");
    }
    function dis_se_lectGeneralRow(GeneralRow) {
        if (GeneralRow.data('id')) {
            if (GeneralRow.hasClass('selected')) {
                GeneralRow.removeClass('selected');
                editIDGeneral = "";
                $('#btnEditGeneral').attr("disabled", "disabled");
                $('#btnDeleteGeneral').attr("disabled", "disabled");
            }
            else {
                tblGeneral.$('tr.selected').removeClass('selected');
                GeneralRow.addClass('selected');
                editIDGeneral = GeneralRow.data("id");
                $('#btnEditGeneral').removeAttr("disabled");
                $('#btnDeleteGeneral').removeAttr("disabled");
            }
        }
    }
    function editGeneral() {
        General.formAction = '/Master/General/GetGeneralDetails';
        if (General.formAction) {
            General.jsonData = { ID: editIDGeneral };
            General.sendData().then(function () {
                populateGeneralData(General.responseData.generalData);
            });
        } else {
            General.showError("Please try again.");
        }
    }
    function populateGeneralData(general) {
        $('#TypeID').prop('readonly', true);
        $("#frmGeneral").parsley().reset();
        $("#btnSaveGeneral .btnLabel").text(" Update");
        $("#mdlGeneralTitle").text(" Update Value");
        General.populateToFormInputs(general, "#frmGeneral");

        var typeOption = new Option(general.TypeDesc, general.TypeID, true, true);
        $('#TypeID').append(typeOption).trigger('change');

        $("#mdlGeneral").modal("show");
    }
    function deleteGeneral() {
        General.formAction = '/Master/General/DeleteGeneral';
        General.jsonData = { ID: editIDGeneral };
        General.sendData().then(function () {
            tblGeneral.ajax.reload(null, false);
            cancelGeneralTbl();
            cancelGeneralForm();
        });
    }

    //Type Functions Here
    function validateType() {
        var type = $("#Type").val().trim();
        if (type) {
            General.formAction = '/Master/General/ValidateType';
            General.jsonData = { Type: type }
            General.sendData().then(function () {
                var validValue = General.responseData.isValid;
                if (!validValue) {
                    General.showError("Type already exists. Please try again.");
                    $("#Type").val("");
                    $("#Type").focus();
                }
            });
        }
    }
    function cancelTypeForm() {
        General.clearFromData("frmType");
        $('#TypeMainID').prop('readonly', false);
        $("#btnSaveType .btnLabel").text(" Save");
        $("#mdlTypeTitle").text(" Create Type");
        $("#mdlType").modal("hide");
        editIDType = '';
    }
    function saveType() {
        General.formData = $('#frmType').serializeArray();
        General.formAction = '/Master/General/SaveType';
        General.setJsonData().sendData().then(function () {
            cancelTypeTbl();
            cancelTypeForm();
            tblType.ajax.reload(null, false);
        });
    }
    function cancelTypeTbl() {
        $('#btnEditType').attr("disabled", "disabled");
        $('#btnDeleteType').attr("disabled", "disabled");
    }
    function dis_se_lectTypeRow(TypeRow) {
        if (TypeRow.hasClass('selected')) {
            TypeRow.removeClass('selected');
            editIDType = "";
            addMode = false;
            $('#btnEditType').attr("disabled", "disabled");
            $('#btnDeleteType').attr("disabled", "disabled");
        }
        else {
            tblType.$('tr.selected').removeClass('selected');
            TypeRow.addClass('selected');
            editIDType = TypeRow.data("id");
            addMode = true;
            $('#btnEditType').removeAttr("disabled");
            $('#btnDeleteType').removeAttr("disabled");
        }
        tblGeneral.ajax.reload(null, false);
    }
    function editType() {
        General.formAction = '/Master/General/GetTypeDetails';
        if (General.formAction) {
            General.jsonData = { ID: editIDType };
            General.sendData().then(function () {
                populateTypeData(General.responseData.generalData);
            });
        } else {
            General.showError("Please try again.");
        }
    }
    function populateTypeData(type) {
        //$('#TypeID').prop('readonly', true);
        $("#frmType").parsley().reset();
        $("#btnSaveType .btnLabel").text(" Update");
        $("#mdlTypeTitle").text(" Update Type");
        General.populateToFormInputs(type, "#frmType");
        $("#mdlType").modal("show");
    }
    function deleteType() {
        General.formAction = '/Master/General/DeleteType';
        General.jsonData = { ID: editIDType };
        General.sendData().then(function () {
            tblType.ajax.reload(null, false);
            tblGeneral.ajax.reload(null, false);
            cancelTypeTbl();
            cancelTypeForm();
        });
    }
})();
