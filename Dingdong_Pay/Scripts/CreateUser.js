"use strict";
(function () {
    var ajax = $D();
    $(document).ready(function () {
        $("#frmUser").submit(function (e) {
            e.preventDefault();
            if ($("#PrivacyPolicy").is(":checked")) {
                $("#ErrorAlert").css("display", "none");
                $("#ErrorList").html("");
                if (ValidatePassword) {
                    ajax.formData = $('#frmUser').serializeArray();
                    ajax.formAction = '/Login/SaveUser';
                    ajax.setJsonData().sendData().then(function () {
                        if (ajax.responseData.Error.length != 0) {
                            var elhtml = "";
                            $.each(ajax.responseData.Error, function (k, v) {
                                elhtml += "<p>" + (k + 1) + " " + v + "</p>";
                            });
                            $("#ErrorAlert").css("display", "block");
                            $("#ErrorList").html(elhtml);
                        } else {
                            ajax.clearFromData("frmUser");
                            location = "/Login/PasswordSuccess?Msg=" + ajax.responseData.msg
                        }
                    });
                } 
            } else {
                $("#ErrorAlert").css("display", "block");
                $("#ErrorList").html("<p>Please check first the Terms and Privacy Policy</p>");
            }
        });

        $("#PrivacyPolicy").change(function (e) {
            if ($(this).is(":checked")) {
                $("#mdlPrivacyPolicy").modal("show");
            }
        });
        $("#btnRegister").click(function (e) {
            $("#frmUser").addClass('was-validated');
        });
        $("#btnMdlRegister").click(function (e) {
            $("#mdlPrivacyPolicy").modal("hide");
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
        if (x.length < 8)
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
            elHtml += "<p>" + (k + 1) + ". " + v + "</p>";
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
