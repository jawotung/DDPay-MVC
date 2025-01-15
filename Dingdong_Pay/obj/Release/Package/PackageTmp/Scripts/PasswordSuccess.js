'use strict';
(function () {
    var ajax = $D();
    $(document).ready(function () {
        GetURL();
    });
    function GetURL() {
        var strx = location.search.substring(1).split('&');
        $("#h2Msg").val(strx[0].substring(strx[0].indexOf("=") + 1));
    }
})();