'use strict';
(function () {
    var ajax = $D();
    $(document).ready(function () {
        $("#Password").focus();
        $("#frmLogin").submit(function (e) {
            e.preventDefault();
            if (ValidatePassword($("#Password").val())) {
                if ($("#Password").val() != $("#ResetPassword").val()) {
                    $("#ErrorAlert").css("display", "block");
                    $("#ErrorList").html("<p>The password and retype password didn't match</p>");
                } else {
                    ajax.formAction = '/Login/SavePassword';
                    ajax.jsonData = { Password: $("#Password").val() };
                    ajax.sendData().then(function () {
                        var login = ajax.responseData;
                        if (login.error) {
                            $("#ErrorAlert").css("display", "block");
                            $("#ErrorList").html("<p>" + login.errmsg + "</p>");
                        } else {
                            location = "/Login/PasswordSuccess?Msg=" + ajax.responseData.msg
                        }
                    });
                }
            }
        });
      
    });
    function ValidatePassword(x) {
        var reNum = /^[0-9]+$/;
        var reBAlpha = /^[A-Z]+$/;
        var resAlpha = /^[a-z]+$/;
        var reSC = /^[!@#$%^&*]+$/;
        
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        var ErrMsg = [];
        if (re.test($("#Password").val())) {
            $("#ErrorAlert").css("display", "block");
            $("#ErrorList").html("<p>Passsss</p>");
        } else {
            $("#ErrorAlert").css("display", "block");
            $("#ErrorList").html("<p>The password and retype password didn't match</p>");
        }
        if (x.length  < 8)
            ErrMsg.push("Should contain 8 charaters");
        if (!reNum.test(x.replace(/[^0-9\.]/g, '')))
            ErrMsg.push("Should contain numbers (0-9)");
        if (!resAlpha.test(x.replace(/[^a-z\.]/g, '')))
            ErrMsg.push("Should contain an upper case letter (a-z)");
        if (!reBAlpha.test(x.replace(/[^A-Z\.]/g, '')))
            ErrMsg.push("Should contain an upper case letter (A-Z)");
        if (!reSC.test(x.replace(/[^!@#$%^&*\.]/g, '')))
            ErrMsg.push("Should contain an special charaters (!@#$%^&*)");
        console.log();
        var elHtml = "";
        $.each(ErrMsg, function (k, v) {
            elHtml += "<p>" + (k+1) + ". " + v + "</p>";
        });
        if (ErrMsg.length == 0) {
            $("#ErrorAlert").css("display", "none");
            $("#ErrorList").html("");
        } else {
            $("#ErrorAlert").css("display", "block");
            $("#ErrorList").html(elHtml);
        }
        return re.test(x);
    }
})();