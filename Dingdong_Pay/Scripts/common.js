$(document).ready(function () {
    LoadInputs();
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    $('#FileUploadLayout').change(function () {
        if ($('#FileUploadLayout')[0].files.length) {
            var files = $('#FileUploadLayout')[0].files;
            var fileNames = [];
            var err = false;
            var arrErr = [];
            for (var i = 0; i <= files.length - 1; i++) {
                var fname = files.item(i).name;
                var fsize = files.item(i).size;
                if (fsize / 1000000 > 50) {
                    arrErr.push("File size is above 50MB. Filename: " + fname);
                    err = true;
                } else {
                    fileNames.push(fname);
                }
            }
            if (err) {
            } else {
                $("#lblFileUploadLayout").val(fileNames.join(", "));
                $("#lblFileUploadLayout").prop("readonly", true);
            }

        } else {
            $("#lblFileUploadLayout").val("");
            $("#lblFileUploadLayout").prop("readonly", false);
        }
    });
    $('#btnHeaderUploadImage').click(function () {
        $("#lblFileUploadLayout").val("");
        $("#lblFileUploadLayout").prop("readonly", false);
        $("#mdlUploadLayout").modal("show");
    });
    $("#btnUploadFileLayout").click(function () {
        var uploadFile = new FormData();
        var file = $("#FileUploadLayout").get(0).files;
        uploadFile.append("UserMaster", file[0]);
        $.ajax({
            type: 'POST',
            url: '/MasterMaintenance/UserMaster/UploadImageSession',
            data: uploadFile,
            cache: false,
            processData: false,
            contentType: false,
        }).done(function () {
            iziToast.show({
                title: "Success",
                message: "Image was successfully uploaded.",
                position: 'topRight',
                backgroundColor: "success",
                theme: 'light', // dark
                color: "green", // blue, red, green, yellow
                timeout: 5000,
            });
            $("#mdlUploadLayout").modal("hide");
        }).fail(function () {

        });
    });
    $(".btnEye").click(function () {
        var PasswordID = $(this).attr("data-password");
        if ($("#Password").attr("type") == "text")
            $(this).html("<i class='icons8-hide-lgrey'></i>");
        else
            $(this).html("<i class='icons8-eye-lgrey'></i>");
    });
    $('.modal').on('show.bs.modal', function (e) {
        $("form").removeClass('was-validated');
    });
});

function LoadInputs() {
    $(".select2-manual").select2({
        placeholder: '--Please select--',
        width: 'auto',
        theme: 'bootstrap4'
    });
    $('.btnPrint').attr("disabled", "disabled");

    $(".date-format").pickadate();
    //$(".date-format").datepicker({
    //    autoclose: true,
    //    todayHighlight: true,
    //    showOtherMonths: true,
    //    selectOtherMonths: true,
    //    changeMonth: true,
    //    changeYear: true,
    //    orientation: "bottom", // <-- and add this
    //    enableOnReadonly: false
    //});
    $('.date-format').each(function () {
        if (!$.trim($(this).attr('maxlength'))) {
            $(this).attr("maxlength", 10);
        }
    });

    $('.date-format').change(function () {
        if ($(this).val().length == 10) {
            if (new Date($(this).val()) == "Invalid Date") {
                $(this).val('');
            }
        } else {
            $(this).val('');
        }
    });

    //$(".year-format").datepicker({
    //    autoclose: true,
    //    todayHighlight: true,
    //    format: "yyyy",
    //    viewMode: "years",
    //    minViewMode: "years",
    //    orientation: "bottom", // <-- and add this
    //    enableOnReadonly: false,
    //    yearRange: "1900:3000"
    //});

    $('.year-format').each(function () {
        if (!$.trim($(this).attr('maxlength'))) {
            $(this).attr("maxlength", 4);
        }
    });
    $('.year-format').change(function () {
        if ($(this).val().length == 4) {
            if (new Date("01/01/" + $(this).val()) == "Invalid Date") {
                $(this).val('');
            }
        } else {
            $(this).val('');
        }
    });

    $(".Number-Only").on("input change paste keypress", function () {
        var newVal = $(this).val().replace(/[^0-9\.-]/g, '');
        $(this).val(newVal.replace(/,/g, ''));
    });

    $(".decimal-format").on("change paste", function () {
        var newVal = $(this).val().replace(/[^0-9\.]/g, '');
        if ($(this).val() != "")
            $(this).val(DecimalFormat(newVal.replace(/,/g, '')));
    });
    $(".decimal-format").on("input", function (e) {
        var t = $(this).val().replace(/,/g, '').replace(/[^0-9\.-]/g, '');
        $(this).val((t.indexOf(".") >= 0) ? (t.split(".")[0].substring(0, 12) + t.substr(t.indexOf("."), 5)) : t.split(".")[0].substring(0, 12));

    });

    $(".percentage-format").on("change paste", function () {
        var newVal = $(this).val().replace(/[^0-9\.]/g, '');
        if (parseFloat(newVal) > 100) {
            $(this).val("0%");
            ShowError("エラー!", "100％未満で入力してください。", "error");
        } else {
            if ($(this).val() != "")
                $(this).val(PercentageFormat(newVal.replace(/,/g, '').replace(/%/g, '')));
        }
    });
    $(".percentage-format").on("input", function (e) {
        var t = $(this).val().replace(/[^0-9\.-]/g, '');
        $(this).val((t.indexOf(".") >= 0) ? (t.split(".")[0].substring(0, 3) + t.substr(t.indexOf("."), 2)) : t.split(".")[0].substring(0, 3));
    });

    $('.decimal-format').each(function () {
        if ($(this).attr('data-maxlenght') != "false") {
            if (!$.trim($(this).attr('maxlength'))) {
                $(this).attr("maxlength", 18);
            }
        }
    });
    $('.percentage-format').each(function () {
        if ($(this).attr('data-maxlenght') != "false") {
            if (!$.trim($(this).attr('maxlength'))) {
                $(this).attr("maxlength", 6);
            }
        }
    });

    $('.input').each(function () {
        if ($(this).attr('data-maxlenght') != "false") {
            if (!$.trim($(this).attr('maxlength'))) {
                $(this).attr("maxlength", 25);
            }
        }

    });


    $(".number-format").on("input change paste", function () {
        var newVal = $(this).val().replace(/[^0-9\.-]/g, '');
        $(this).val(numberFormat(newVal.replace(/,/g, '')));
    });

    $(".number-format").on("keypress", function (e) {
        if (e.key == ".") {
            e.preventDefault();
        }

        if ($(this).val().indexOf("-") != -1 && e.key == "-") {
            e.preventDefault();
        }
    });

}

function numberFormat(number, style, currency) {
    var num;
    if (style === '' && currency === '') {
        num = new Intl.NumberFormat('en', {
            style: style,
            currency: currency
        }).format(number)

        if ('NaN' == num) {
            num = '';
        }

        return num;
    }

    num = new Intl.NumberFormat('en').format(number);

    if ('NaN' == num) {
        num = '';
    }

    return num;
}
function DecimalFormat(number) {
    var num;
    var t = number.toString();
    var digit = 0;
    if (t.indexOf(".") > -1) {
        t = t.toString().replace(/\.?0+$/, '');
        digit = t.substr(t.toString().replace(/\.?0+$/, '').indexOf("."), 5).length - 1;
    }
    if (number % 1 == 0)
        num = new Intl.NumberFormat('en', {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number)
    else
        num = new Intl.NumberFormat('en', {
            style: "decimal",
            minimumFractionDigits: digit,
        }).format(number)



    if ('NaN' == num) {
        num = '';
    }
    return num;
}
function PercentageFormat(number) {
    var num;
    if (number != "") {
        num = new Intl.NumberFormat('en', {
            style: "decimal",
        }).format(number.toString().replace(/%/g, ""))

        if ('NaN' == num) {
            num = '';
        }
        num = num.replace(/%+$/, "");
        return num + "%";
    } else { return ""; }
}

function DateFormat(date_value) {
    var d = new Date(date_value);
    var today_date = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();
    return today_date;
}
function TimeNow(time_value) {
    var d = new Date(time_value);
    var today_date = ("0" + (d.getHours())).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return today_date;
}
function DateNow() {
    var d = new Date();
    var today_date = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();
    return today_date;
}
function TimeNow() {
    var d = new Date();
    var today_date = ("0" + (d.getHours())).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return today_date;
}
function DateMonthStart() {
    var d = new Date();
    var today_date = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + "01" + "/" + d.getFullYear();
    return today_date;
}
function DateNowPlusWeek() {
    var date = new Date();
    var d = date.addDays(7);
    var today_date = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();
    return today_date;
}
function DateMonthEnd() {
    var date = new Date();
    var d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var today_date = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();
    return today_date;
}

function checkAllCheckboxesInTable(tblID, checkAllClass, checkItemClass) {
    $(checkAllClass).on('change', function (e) {

        //$('td input:checkbox', tblID).not(this).prop('checked', this.checked);
        $('input:checkbox' + checkItemClass).not(this).prop('checked', this.checked);

        var checked = 0;
        var table = $(tblID).DataTable();
        for (var x = 0; x < table.context[0].aoData.length; x++) {
            if ($.trim(table.context[0].aoData[x].anCells[0].firstChild)) {
                if (table.context[0].aoData[x].anCells[0].firstChild.checked == true) {
                    checked++;
                }
            }

        }
    });
}


function SerializeArray(form) {
    var formData = new FormData();
    $.each(form[0], function (k, v) {
        if ($(this).hasClass("input")) {
            var type = $(this).attr('type');
            if (type === "text" || type === "hidden" || type === "password" || $(this).is("select") || $(this).is("textarea") || type == "number") {
                if ($(this).hasClass("decimal-format"))
                    formData.append($(this)[0].name, $(this).val().replace(/,/g, ''));
                else
                    formData.append($(this)[0].name, $(this).val());
            }
        }
    });
    return formData;
}

function CheckSession(ajax) {
    return true;
}
function GetPeriod(ajax) {
    return $.ajax({
        url: '/Budget/PeriodYear/GetPeriodYear',
        type: 'GET',
        dataType: 'JSON',
        data: { },
    }).done(function (data, textStatus, xhr) {
        return ajax.responseData;
    });
}

function fileExtension(ext) {
    var data = {
        icon: "",
        ext: ""
    };
    switch (ext.toLowerCase()) {
        // Audio files
        case ".cda":
        case ".mid":
        case ".midi":
        case ".mp3":
        case ".mpa":
        case ".ogg":
        case ".wav":
        case ".wma":
        case ".wpl":
        case ".aif":
            data.icon = "fa fa-file-audio";
            data.ext = ext.split('.').join("");
            return data;
            break;

        // Compressed files
        case ".7z":
        case ".tar.gz":
        case ".deb":
        case ".rpm":
        case ".arj":
        case ".pkg":
        case ".rar":
        case ".z":
        case ".zip":
            data.icon = "fa fa-file-archive";
            data.ext = ext.split('.').join("");
            return data;
            break;

        // Image Files
        case ".gif":
        case ".bmp":
        case ".svg":
        case ".ps":
        case ".psd":
        case ".png":
        case ".ai":
        case ".ico":
        case ".jpeg":
        case ".jpg":
        case ".tif":
        case ".tiff":
            data.icon = "fa fa-file-image";
            data.ext = ext.split('.').join("");
            return data;
            break;

        // Internet Files
        case ".aps":
        case "aspx":
        case ".cer":
        case ".cfm":
        case ".css":
        case ".html":
        case ".htm":
        case ".js":
        case ".jsp":
        case ".part":
        case ".php":
        case ".py":
        case ".rss":
        case ".xhtml":
            data.icon = "fa fa-file-code";
            data.ext = ext.split('.').join("");
            return data;
            break;

        // Presentation Files
        case ".key":
        case ".odp":
        case ".pps":
        case ".ppt":
        case ".pptx":
            data.icon = "fa fa-file-powerpoint";
            data.ext = ext.split('.').join("");
            return data;
            break;

        // Spreadsheet
        case ".ods":
        case ".xls":
        case ".xlsm":
        case ".xlsx":
            data.icon = "fa fa-file-excel";
            data.ext = ext.split('.').join("");
            return data;
            break;

        // Video files
        case ".3g2":
        case ".3gp":
        case ".avi":
        case ".flv":
        case ".h264":
        case ".m4v":
        case ".mkv":
        case ".mov":
        case ".mp4":
        case ".mpg":
        case ".mpeg":
        case ".rm":
        case ".wmv":
            data.icon = "fa fa-file-video";
            data.ext = ext.split('.').join("");
            return data;
            break;

        // Word Docu files
        case ".txt":
        case ".csv":
            data.icon = "fa fa-file-text";
            data.ext = ext.split('.').join("");
            return data;
            break;

        case ".pdf":
            data.icon = "fa fa-file-pdf";
            data.ext = ext.split('.').join("");
            return data;
            break;

        case ".docx":
        case ".doc":
        case ".odt":
        case ".rtf":
        case ".tex":
        case ".wpd":
            data.icon = "fa fa-file-word";
            data.ext = ext.split('.').join("");
            return data;
            break;

        default:
            data.icon = "fa fa-file";
            data.ext = ext.split('.').join("");
            return data;
            break;
    }
}

function showInputError(id, msg) {
    $('.' + id + '_grp').addClass("has-error");
}

function hideInputError(id) {
    $('.' + id + '_grp').removeClass("has-error");
}

var pressed = false;
var chars = [];
function PreventKeyInput(eventForTextBox, id) {
    chars.push(String.fromCharCode(eventForTextBox.which));
    if (pressed == false) {
        setTimeout(function () {
            if (chars.length >= 9) {
                var barcode = chars.join("");
            } else {
                document.getElementById(id).value = "";
            }
            chars = [];
            pressed = false;
        }, 300);
    }
    pressed = true;
}

function ShowMsg(ajax, status, msg) {
    var title = "";
    if ("error" == status)
        title = "エラー!";
    else if ("success" == status)
        title = "成功!";

    ajax.msgType = status;
    ajax.msgTitle = title;
    ajax.msg = msg;
    ajax.showToastrMsg();

}

function ShowError(msgTitle, msg, msgType) {
    var msgToastrType = {
        "info": "fa fa-info-circle",
        "warning": "fas fa-lg fa-fw m-r-10 fa-exclamation-triangle",
        "success": "fa fa-check-square-o",
        "error": "fa fa-times-circle",
    };
    var txtColor = {
        "info": "blue",
        "warning": "yellow",
        "success": "green",
        "error": "red",
    };
    iziToast.show({
        title: msgTitle,
        message: msg,
        icon: msgToastrType[msgType],
        position: 'topRight',
        backgroundColor: '',
        theme: 'light', // dark
        color: txtColor[msgType], // blue, red, green, yellow
        timeout: 5000,
    });
}