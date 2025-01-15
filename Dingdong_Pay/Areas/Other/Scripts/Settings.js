"use strict";
(function () {
    var ajax = $D();
    $(document).ready(function () {
        $(".cardClick").click(function (e) {
            var ID = $(this).attr("id");
            $("#div" + ID.substring(1)).css("display", "block");
            $("#mainSecurity").css("display", "none");
            $("#mainSupport").css("display", "none");
        });
        $(".HcardClick").click(function (e) {
            $('.cardClick').each(function () {
                var ID = $(this).attr("id");
                $("#div" + ID.substring(1)).css("display", "none");
            });
            $("#mainSecurity").css("display", "block");
            $("#mainSupport").css("display", "block");
        });
     
    });
})();