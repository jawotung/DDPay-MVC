'use strict';
(function () {
    var ajax = $D();
    $(document).ready(function () {
        $("#Username").focus();
        $("#frmLogin").submit(function (e) {
            e.preventDefault();
            ajax.formAction = '/Login/SessionForgotPassword';
            ajax.jsonData = { ForgotPassword: $("#ForgotPassword").val() };
            ajax.sendData().then(function () {
                if (ajax.responseData.error) {
                    $("#ErrorAlert").css("display", "block");
                    $("#ErrorList").html("<p>" + login.errmsg + "</p>");
                } else {
                    window.location = "/Login/OTTP";
                }
            });
        });
    });
})();