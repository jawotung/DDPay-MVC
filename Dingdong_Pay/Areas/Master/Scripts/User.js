"use strict";
(function () {
    var ajax = $D();
    var tblUser = "";

    $(document).ready(function () {
        drawDatatables();

        $('#tblUser tbody').on('click', 'tr', function (e) {
            switch (e.target.localName) {
                case "button":
                    break;
                case "span":
                    break;
                case "checkbox":
                    break;
                case "i":
                    break;
                case "textbox":
                    break;
                case "input":
                    break;
                default:
                    var data = tblUser.row($(this)).data();
                    if ($.trim(data) != "") {
                        if ($(this).hasClass('selected')) {
                            LoadForm();
                            $('#btnEdit').removeAttr("disabled");
                            $('#btnDelete').removeAttr("disabled");
                            $('#btnUserAccess').removeAttr("disabled");
                        }
                        else {
                            tblUser.$('tr.selected').removeClass('selected');
                            $(this).addClass('selected');
                            $('#btnEdit').removeAttr("disabled");
                            $('#btnDelete').removeAttr("disabled");
                            $('#btnUserAccess').removeAttr("disabled");
                        }
                    }
                    break;
            }
        });
        $("#tblUser").on("change", '.columnSearch', function () {
            tblUser.ajax.reload(null, false);
        });

        $("#btnAdd").click(function () {
            $("#mdlUser").modal("show");
            tblUser.ajax.reload(null, false);
            cancelUserTbl();
            cancelUserForm();
        });
        $('#btnEdit').click(function () {
            LoadForm();
        });
        $('#btnDelete').click(function () {
            var data = tblUser.rows('.selected').data()[0];
            ajax.msg = "Are you sure you want to delete this User?";
            ajax.confirmAction().then(function (approve) {
                if (approve) {
                    ajax.formAction = '/Master/User/DeleteUser';
                    ajax.jsonData = { ID: data.ID};
                    ajax.sendData().then(function () {
                        tblUser.ajax.reload(null, false);
                        cancelUserTbl();
                        cancelUserForm();
                    });
                }
            });
        });
        $("#btnSaveUser").click(function (e) {
            $("#frmUser").addClass('was-validated');
        });
        $("#frmUser").submit(function (e) {
            e.preventDefault();
            ajax.formData = $('#frmUser').serializeArray();
            ajax.formAction = '/Master/User/SaveUser';
            ajax.setJsonData().sendData().then(function () {
                tblUser.ajax.reload(false);
                cancelUserTbl();
                cancelUserForm();
                $("#mdlUser").modal("hide");
            });
        });
        $('#btnUserAccess').click(function () {
            var data = tblUser.rows('.selected').data()[0];
            ajax.formAction = '/Master/User/GetUserAccess';
            ajax.jsonData = { ID: data.ID };
            ajax.sendData().then(function () {
                drawUserMenu(ajax.responseData);
            });
        });
        $("#btnClear").click(function () {
            if (tblUser.rows('.selected').data().length != "0") {
                $('#btnEdit').click();
            } else {
                ajax.clearFromData("frmUser");
            }
        });

        $("#mdlBodyUserAccess").on("click", ".parentMenu", function () {
            var childClass = $(this).data("childclass");
            $("." + childClass).prop("checked", $(this).is(":checked"));
        });
        $("#mdlBodyUserAccess").on("click", ".subMenu", function () {
            var parentID = $(this).data("parent");
            var myClass = $(this).data("myclass");
            $("#" + parentID).prop("checked", $("." + myClass + ":checked").length);
        });

        $("#btnSaveUserAccess").click(function () {
            saveUserAccess();
        });

        $('#btnPrint').on('click', function (e) {
            tblUser.ajax.reload(null, false);
            window.location = "/Master/User/Download?fileName=User";
        });
    });

    function drawDatatables() {
        if (!$.fn.DataTable.isDataTable('#tblUser')) {
            tblUser = $('#tblUser').DataTable({
                searching: false,
                processing: true,
                serverSide: true,
                "pageLength": 25,
                "ajax": {
                    "url": "/Master/User/GetUserList",
                    "type": "POST",
                    "datatype": "json",
                    "data": function (d) {
                        $('#tblUser thead #trSearch th').each(function () {
                            var field = $(this).data("field");
                            d[field] = encodeURI($(this).find('input').val()).replace(/%20/g, " ");
                        });
                    }
                },
                dataSrc: "data",
                columns: [
                    { title: "Username", data: "Username" },
                    { title: "First Name", data: 'FirstName' },
                    { title: "Last Name", data: 'LastName' },
                    { title: "Middle Name", data: 'MiddleName' },
                    { title: "Email", data: 'Email' },
                    { title: "Position", data: 'Position' },
                ],
                "initComplete": function () {
                    //$('#tblUser thead').addClass('thead-dark');
                    $("#tblUser thead #trSearch").remove();
                    var thead1 = "<tr id='trSearch'>";
                    $.each(this.api().column(0).context[0].aoColumns, function (k, v) {
                        thead1 += "<th data-field='" + v.data + "'>" + v.sTitle + "</th>";
                    });
                    thead1 += "</tr>";
                    $("#tblUser thead").append(thead1);
                    $('#tblUser thead #trSearch th').each(function () {
                        var title = $(this).text();
                        var field = $(this).data("field");
                        if (field) {
                            $(this).html("<input class='form-control form-control-sm text-center columnSearch' style='display: inline;width: 100%;height: 100%box-sizing: border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;border: none;' placeholder='" + title + "' type='text'/>");
                            $('#tblUser thead #trSearch th').each(function () {
                                var field = $(this).data("field");
                            });
                        }
                    });
                },
                "fnDrawCallback": function () {
                    LoadInputs();
                    $('.btnPrint').removeAttr("disabled");
                },
                "preDrawCallback": function () {
                    $('.btnPrint').attr("disabled", "disabled");
                }
            })
        }
    }
    function LoadForm() {
        var x = tblUser.rows('.selected').data()[0];
        $("#frmUser").parsley().reset();
        $('#Username').prop('readonly', true);
        if (x.Role == "Custom")
            $("#Role").append("<option value='Custom'>Custom</option>");
        else
            $("#Role option[value='Custom']").remove();
        var Department = new Option(x.DepartmentName, x.Department, true, true);
        $('#Department').append(Department).trigger('change');
        var SubDepartment = new Option(x.SubDepartmentName, x.SubDepartment, true, true);
        $('#SubDepartment').append(SubDepartment).trigger('change');
        ajax.populateToFormInputs(x, "#frmUser");
        $("#mdlUser").modal("show");
    }
    function cancelUserForm() {
        ajax.clearFromData("frmUser");
        $('#Username').prop('readonly', false);
        $("#Role option[value='Custom']").remove();
    }
    function cancelUserTbl() {
        $('#btnEdit').attr("disabled", "disabled");
        $('#btnDelete').attr("disabled", "disabled");
        $('#btnUserAccess').attr("disabled", "disabled");
    }

    function drawUserMenu(menu) {
        const tmpForParentMenu = menu;
        const tmpForSubMenu = menu;
        //Grouping menus into GroupLabel
        var arrGroupedData = _.mapValues(_.groupBy(menu, 'GroupLabel'), (function (clist) {
            return clist.map(function (byGroupLabel) {
                return _.omit(byGroupLabel, 'GroupLabel');
            });
        }));
        //End Grouping menus into GroupLabel 
        //Creating GroupLabel Tab Link
        var menuTab = "<ul class='nav nav-tabs'>";
        $.each(arrGroupedData, function (i) {
            var GroupLabelID = i == "" ? "Common" : i;
            var active = i == "" ? "active" : "";
            menuTab += "<li class='nav-items'>\
                                    <a href='#tab" + GroupLabelID + "' data-toggle='tab' class='nav-link " + active + "'>\
                                        <span class='d-sm-none'>" + GroupLabelID + "</span>\
                                        <span class='d-sm-block d-none'> " + GroupLabelID + "</span>\
                                    </a>\
                                 </li>";
        });
        menuTab += "</ul>";
        //End Creating GroupLabel Tab Link

        //Creating GroupLabel Tab Content
        menuTab += "<div class='tab-content'>";
        $.each(arrGroupedData, function (i, groupedMainMenu) {
            var GroupLabelID = i == "" ? "Common" : i;
            var active = i == "" ? "active" : "";
            //Creating GroupLabel Individual Tab Content
            menuTab += "<div class='tab-pane show " + active + "' id='tab" + GroupLabelID + "'>";
            //Creating Parent Menu Tab Link
            menuTab += "    <ul class='nav nav-tabs'>";
            var parentMenu = _.filter(groupedMainMenu, function (obj) { return obj.Icon != 0; });
            var sortedParentMenu = _.sortBy(parentMenu, function (o) { return new Number(o.ParentOrder); }, ['asc']);
            $.each(sortedParentMenu, function (ii) {
                var active1 = (ii == 0 && GroupLabelID == "Common") || (ii == 0 && GroupLabelID != "Common") ? 'active' : '';
                if (this.URL != "/") {
                    menuTab += "<li class='nav-items'>\
                                    <a href='#tab" + (this.PageName).replace(/\s/g, "") + "' data-toggle='tab' class='nav-link " + active1 + "'>\
                                        <span class='d-sm-none'><span class='" + this.Icon + "'></span> " + this.PageLabel + "</span>\
                                        <span class='d-sm-block d-none'><span class='" + this.Icon + "'></span> " + this.PageLabel + "</span>\
                                    </a>\
                                 </li>";
                }
            });
            menuTab += "    </ul>";
            //End Creating Parent Menu Tab Link
            //Creating Parent Menu Tab Content
            menuTab += "<div class='tab-content'>";
            $.each(sortedParentMenu, function (iii, m) {
                if (this.URL != "/") {
                    var PageName = this.PageName;
                    var PageLabel = this.PageLabel;
                    var submenus = _.filter(groupedMainMenu, function (obj) {
                        return obj.ParentMenu == PageName && obj.Icon == 0;
                    });
                    var sortedSubmenu = _.sortBy(submenus, function (o) { return new Number(o.Order); }, ['asc']);

                    //var show = i == 1 ? 'fade active' : '';
                    var show = (iii == 0 && GroupLabelID == "Common") || (iii == 0 && GroupLabelID != "Common") ? 'fade active' : '';
                    var checked = this.Status != '' ? 'checked' : '';

                    var readOnly = this.ReadAndWrite ? '' : 'checked';
                    var readAndWrite = this.ReadAndWrite ? 'checked' : '';
                    var delChecked = this.Delete ? 'checked' : '';
                    //Creating indivdial menu list content
                    menuTab += "<div class='tab-pane show " + show + "' id='tab" + (PageName).replace(/\s/g, '') + "'>";
                    menuTab += "    <ul>";
                    menuTab += "        <li>";
                    menuTab += "            <div class='checkbox checkbox-css checkbox-inline'>\
                                                    <input type='checkbox'  id='chk" + PageName.replace(/\s/g, '') + "' value='" + this.ID + "' " + checked + " data-pagename='" + PageName.replace(/\s/g, '') + "'  data-childclass='" + PageName.replace(/\s/g, '') + "' class='parentMenu chkUserAccess clickable'>\
                                                    <label class='clickable' for='chk" + PageName.replace(/\s/g, '') + "'>" + PageLabel + "</label>\
                                                </div>";
                    if (!this.HasSub) {
                        menuTab += "            <div class='radio radio-css radio-inline m-l-20'>\
                                                        <input class='form-check-input clickable' type='radio' name='rdoReadAndWrite" + PageName.replace(/\s/g, '') + "' id='rdoRead" + PageName.replace(/\s/g, '') + "' value='0' " + readOnly + ">\
                                                        <label class='form-check-label clickable' for='rdoRead" + PageName.replace(/\s/g, '') + "'>Read Only</label>\
                                                    </div>\
                                                    <div class='radio radio-css radio-inline '>\
                                                        <input class='form-check-input clickable' type='radio' name='rdoReadAndWrite" + PageName.replace(/\s/g, '') + "' id='rdoReadWrite" + PageName.replace(/\s/g, '') + "' value='1' " + readAndWrite + ">\
                                                        <label class='form-check-label clickable' for='rdoReadWrite" + PageName.replace(/\s/g, '') + "'>Read & Write</label>\
                                                    </div>";
                        menuTab += "            <div class='checkbox checkbox-css checkbox-inline m-l-20'>\
                                                        <input type='checkbox'  id='chkDel" + PageName.replace(/\s/g, "") + "' value='" + this.ID + "' " + delChecked + " data-pagename='" + PageName.replace(/\s/g, "") + "' class='clickable'>\
                                                        <label class='clickable' for='chkDel" + PageName.replace(/\s/g, "") + "'>Delete</label>\
                                                    </div>";
                    }
                    menuTab += "        </li>";

                    if (sortedSubmenu.length) {
                        if (PageName == sortedSubmenu[0].ParentMenu) {
                            menuTab += "        <li>";
                            menuTab += "            <ul>";
                            $.each(sortedSubmenu, function (index) {
                                var subChecked = this.Status != '' ? 'checked' : '';
                                var readOnlySub = this.ReadAndWrite ? '' : 'checked';
                                var delChecked = this.Delete ? 'checked' : '';
                                var readAndWriteSub = this.ReadAndWrite ? 'checked' : '';
                                menuTab += "            <li>";
                                menuTab += "                <div class='row'>";
                                menuTab += "                    <div class='col-sm-3'>";
                                menuTab += "                        <div class='checkbox checkbox-css checkbox-inline'>\
                                                                            <input type='checkbox'  id='chkSub" + this.PageName.replace(/\s/g, "") + "' value='" + this.ID + "' " + subChecked + " data-pagename='" + this.PageName.replace(/\s/g, "") + "' data-parent='chk" + this.ParentMenu.replace(/\s/g, "") + "' data-myclass='" + this.ParentMenu.replace(/\s/g, "") + "' class='subMenu chkUserAccess " + this.ParentMenu.replace(/\s/g, "") + " clickable'>\
                                                                            <label class='clickable' for='chkSub" + this.PageName.replace(/\s/g, "") + "'>" + this.PageName + "</label>\
                                                                        </div>";
                                menuTab += "                    </div>";
                                menuTab += "                    <div class='col-sm-3'>";
                                menuTab += "                        <div class='radio radio-css radio-inline'>\
                                                                            <input class='form-check-input clickable ' type='radio' name='rdoReadAndWrite" + this.PageName.replace(/\s/g, '') + "' id='rdoRead" + this.PageName.replace(/\s/g, '') + "' value='0' " + readOnlySub + ">\
                                                                            <label class='form-check-label  clickable' for='rdoRead" + this.PageName.replace(/\s/g, '') + "'>Read Only</label>\
                                                                        </div>\
                                                                    </div>";
                                menuTab += "                    <div class='col-sm-3'>\
                                                                        <div class='radio radio-css radio-inline'>\
                                                                            <input class='form-check-input clickable' type='radio' name='rdoReadAndWrite" + this.PageName.replace(/\s/g, '') + "' id='rdoReadWrite" + this.PageName.replace(/\s/g, '') + "' value='1' " + readAndWriteSub + ">\
                                                                            <label class='form-check-label  clickable' for='rdoReadWrite" + this.PageName.replace(/\s/g, '') + "'>Read & Write</label>\
                                                                        </div>\
                                                                    </div>";
                                menuTab += "                    <div class='col-sm-3'>";
                                menuTab += "                        <div class='checkbox checkbox-css checkbox-inline'>\
                                                                            <input type='checkbox'  id='chkDel" + this.PageName.replace(/\s/g, "") + "' value='" + this.ID + "' " + delChecked + " class='clickable'/>\
                                                                            <label class='clickable' for='chkDel" + this.PageName.replace(/\s/g, "") + "'>Delete</label>\
                                                                        </div>";
                                menuTab += "                    </div>";
                                menuTab += "                </div>";
                                menuTab += "            </li>";
                            });
                            menuTab += "            </ul>";
                            menuTab += "        </li>";
                        }
                    }

                    menuTab += "    </ul>";
                    menuTab += "</div>";
                    //End Creating indivdial menu list content
                }
            });

            menuTab += "</div>";
            //Creating Parent Menu Tab Content
            menuTab += "</div>";
            //End Creating GroupLabel Individual Tab Content
        });
        menuTab += "</div>";
        //End Creating GroupLabel Tab Content
        $("#mdlBodyUserAccess").html(menuTab);
        $("#mdlUserAccess").modal("show");
        return;
        //==============================================================================================================================================================
    }
    function saveUserAccess() {
        var data = tblUser.rows('.selected').data()[0];
        var arrAccessList = [];
        $(".chkUserAccess").each(function (i, val) {
            var userAccessList = {};
            var status = "";
            var pagename = $(this).data("pagename");
            var readAndWrite = "0";
            var deleteFunction = "0";
            if ($(this).is(":checked")) {
                status = true;
            } else {
                status = false;
            }
            if ($("input[name=rdoReadAndWrite" + pagename + "]").length) {
                readAndWrite = $("input[name=rdoReadAndWrite" + pagename + "]:checked").val();
            }
            if ($("#chkDel" + pagename).is(":checked")) {
                deleteFunction = "1"
            }
            userAccessList = {
                UserID: data.ID,
                PageID: $(this).val(),
                Status: status,
                ReadAndWrite: readAndWrite,
                Delete: deleteFunction
            }
            arrAccessList.push(userAccessList);
        })
        ajax.formAction = '/Master/User/SaveUserAccess';
        ajax.jsonData = { userAccessList: arrAccessList };
        ajax.sendData().then(function (response) {
            tblUser.ajax.reload(null, false);
            cancelUserTbl();
            $("#mdlUserAccess").modal("hide");
        });
    }
})();
