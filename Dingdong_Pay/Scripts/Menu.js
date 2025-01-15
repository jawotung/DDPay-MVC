'use strict';
(function () {
    var AccessType = 0;
    var DeleteEnabled = 0;
    var activeMainMenuClass = "";
    var activeMainMenuLink = "";
    var activeSubMenuClass = "";
    var menuBar = "";
    $(document).ready(function () {
        var menu = $("#hdnMenu").val();
        var currentlUrl = $("#hdnMenu").data("currurl");
        var Warehouse = $("#hdnMenu").attr('data-Warehouse');
        if ($("#hdnMenu").length) if (menu.replace(" ", "") != "") drawUserMenu(JSON.parse(menu));

        function drawUserMenu(menu) {
            const tmpForParentMenu = menu;
            const tmpForSubMenu = menu;
            var arrGroupedData = _.mapValues(_.groupBy(menu, 'GroupLabel'), (function (clist) {
                return clist.map(function (byGroupLabel) {
                    return _.omit(byGroupLabel, 'GroupLabel');
                });
            }));
            $.each(arrGroupedData, function (i, groupedMainMenu) {
                if (i)
                    menuBar += "<li class='nav-header'>" + i + "</li>";
                //var parentMenu = _.filter(groupedMainMenu, function (obj) {
                //    return obj.Icon != 0;
                //});
                var parentMenu = groupedMainMenu
                var sortedParentMenu = _.sortBy(parentMenu, function (o) { return new Number(o.ParentOrder); }, ['asc']);
                $.each(sortedParentMenu, function (i, m) {
                    var PageName = this.PageName;
                    var submenus = _.filter(groupedMainMenu, function (obj) {
                        return obj.ParentMenu == PageName && obj.Icon == 0;
                    });
                    var sortedSubmenu = _.sortBy(submenus, function (o) { return new Number(o.Order); }, ['asc']);

                    if (currentlUrl == this.URL) {
                        activeMainMenuClass = "active";

                        if (!this.HasSub && this.ReadAndWrite == "True" || this.ReadAndWrite == 1) {
                            AccessType = 1;
                        }
                        if (!this.HasSub && this.DeleteEnabled == "True" || this.DeleteEnabled == 1) {
                            DeleteEnabled = 1;
                        }
                    } else {
                        activeMainMenuClass = "";
                    }
                    if (!this.HasSub) {
                        if (currentlUrl == this.URL) {
                            activeMainMenuClass = "active";
                        } else {
                            activeMainMenuClass = "";
                        }
                        menuBar += "<li class='nav-item  " + activeMainMenuClass + " paddingTopBottom10'>\
                                        <a href='" + this.URL + "'><i class='" + this.Icon + "'></i> <span>" + this.PageLabel + "</span></a>\
                                    </li>";
                    } else {

                        menuBar += '<li class=" navigation-header"><span>' + this.PageLabel + '</span></li>';
                        if (sortedSubmenu.length) {
                            if (PageName == sortedSubmenu[0].ParentMenu) {
                                $.each(sortedSubmenu, function (index) {
                                    if (currentlUrl == this.URL) {
                                        activeMainMenuLink = this.ParentMenu;
                                        activeSubMenuClass = "active";
                                        if (this.ReadAndWrite == "True" || this.ReadAndWrite == 1) {
                                            AccessType = 1;
                                        }
                                        if (this.DeleteEnabled == "True" || this.DeleteEnabled == 1) {
                                            DeleteEnabled = 1;
                                        }
                                    } else {
                                        activeSubMenuClass = "";
                                    }
                                    menuBar += "<li class='nav-item " + activeSubMenuClass + " paddingTopBottom10'>\
                                                    <a href='" + this.URL + "'><i class='" + this.SubIcon + "'></i>" + this.PageLabel + "</a>\
                                                </li>";
                                });
                            }
                        }
                    }
                });
            });
            $("#main-menu-navigation").append(menuBar);


            $(".has-sub").removeClass("active");
            if (activeMainMenuLink)
                $("#" + activeMainMenuLink).addClass("active");
            if (AccessType) {
                $(".ReadAndWrite").show();
                $("body").attr("data-readandwrite", "true");
                $("body").addClass("ReadAndWrite");
                $("body").removeClass("ReadOnly");
            } else {
                $(".ReadAndWrite").hide();
                $("body").attr("data-readandwrite", "false");
                $(".ReadAndWrite").remove();
                $("body").removeClass("ReadAndWrite");
                $("body").addClass("ReadOnly");
            }
            if (DeleteEnabled) {
                $(".DeleteEnabled").show();
                $("body").attr("data-deleteenabled", "true");
                $("body").addClass("DeleteEnabled");
                $("body").removeClass("DeleteDisabled");
            } else {
                $(".DeleteEnabled").hide();
                $("body").attr("data-deleteenabled", "false");
                $(".DeleteEnabled").remove();
                $("body").removeClass("DeleteEnabled");
                $("body").addClass("DeleteDisabled");
            }
            $(document).ajaxComplete(function () {
                setTimeout(function () {
                    if (AccessType) {
                        $(".ReadAndWrite").show();
                        $("body").attr("data-readandwrite", "true");
                    } else {
                        $(".ReadAndWrite").hide();
                        $("body").attr("data-readandwrite", "false");
                        $(".ReadAndWrite").remove();
                    }
                    if (DeleteEnabled) {
                        $(".DeleteEnabled").show();
                        $("body").attr("data-deleteenabled", "true");
                    } else {
                        $(".DeleteEnabled").hide();
                        $("body").attr("data-deleteenabled", "false");
                        $(".DeleteEnabled").remove();
                    }
                }, 100);
            });
        }
    });
})();
