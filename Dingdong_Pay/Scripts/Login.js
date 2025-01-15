'use strict';
(function () {
    var ajax = $D();
    $(document).ready(function () {
        $("#Username").focus();
        $("#frmLogin").submit(function (e) {
            console.log($(this).serializeArray());
            e.preventDefault();
            ajax.formData = $(this).serializeArray();
            ajax.formAction = '/Login/LoginEntry';
            ajax.setJsonData().sendData().then(function () {
                var login = ajax.responseData;
                if (login.error) {
                    $("#ErrorAlert").css("display", "block");
                    $("#ErrorList").html("<p>" + login.errmsg + "</p>");
                    $("#Username").addClass("input-error");
                    $("#Password").addClass("input-error");
                    $(".input-group-append").addClass("input-error");
                    $("#Username").addClass("parsley-success");
                    $("#Password").addClass("parsley-success");
                    $("#Password").val("");
                } else {
                    $("#ErrorAlert").css("display", "none");
                    $("#ErrorList").html("");
                    $("#Username").removeClass("input-error");
                    $("#Password").removeClass("input-error");
                    $("#frmLogin > div.login-buttons > button").attr("disabled", true);
                    window.location = "/Transaction/Bills";
                }
            });
        });
    });
})();