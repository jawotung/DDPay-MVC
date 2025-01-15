'use strict';
(function () {
    var ajax = $D();
    var Resend = 0
    var timer2 = "02:01";
    $(document).ready(function () {
        $("#OOTP").focus();

        OTPCountDown();
        $("#frmLogin").submit(function (e) {
            e.preventDefault();
            ajax.formAction = '/Login/ValidateOTTP';
            ajax.jsonData = { OTP: $("#OTP").val() };
            ajax.sendData().then(function () {
                if (ajax.responseData.error) {
                    $("#ErrorAlert").css("display", "block");
                    $("#ErrorList").html("<p>" + login.errmsg + "</p>");
                } else {
                    window.location = "/Login/ResetPassword";
                }
            });
        });
        $(".countdown").click(function (e) {
            e.preventDefault();
            if (Resend == 1) {
                ajax.formAction = '/Login/ResendOTP';
                ajax.jsonData = { OTP: $("#OTP").val() };
                ajax.sendData().then(function () {
                    $("#ErrorAlert").css("display", "none");
                    $("#ErrorList").html("");
                    timer2 = "02:01";
                    OTPCountDown();
                });
            }
            
        });

    });
    function OTPCountDown() {
        var interval = setInterval(function () {
            var timer = timer2.split(':');
            var minutes = parseInt(timer[0], 10);
            var seconds = parseInt(timer[1], 10);
            --seconds;
            minutes = (seconds < 0) ? --minutes : minutes;
            if (minutes < 0) clearInterval(interval);
            seconds = (seconds < 0) ? 59 : seconds;
            seconds = (seconds < 10) ? '0' + seconds : seconds;
            if (minutes + ':' + seconds != "-1:59") {
                $('.countdown').html("Resend " + minutes + ':' + seconds);
                Resend = 0;
            }
            else {
                $('.countdown').html("Click here to resend");
                Resend = 1;
            }
            timer2 = minutes + ':' + seconds;
        }, 1000);
    }
})();