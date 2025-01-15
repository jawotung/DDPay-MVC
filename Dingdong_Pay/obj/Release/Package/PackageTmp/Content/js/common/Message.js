;
(function (global, $) {
    const Message = function (msgType, msgTitle, msg, func, trxId) {
        return new Message.init(msgType, msgTitle, msg, func, trxId);
    }
    Message.init = function (msgType, msgTitle, msg, func, trxId) {
        this.msgType = msgType || "";
        this.msgTitle = msgTitle || "";
        this.msg = msg || "";
        this.trxId = trxId || "";
        this.func = func || "";

        this.msgToastrType = {
            "info": "fa fa-info-circle",
            "warning": "fas fa-lg fa-fw m-r-10 fa-exclamation-triangle",
            "success": "fa fa-check-square-o",
            "error": "fa fa-times-circle",
        };
        this.txtColor = {
            "info": "blue",
            "warning": "yellow",
            "success": "green",
            "error": "red",
        };
    }
    Message.prototype = {
        getError: function () {
            var errorList = "";
            if (Array.isArray(this.msg) || typeof this.msg === "object") {
                $.each(this.msg, function (key, value) {
                    errorList += '<div>' + (key + 1) + ". " + value + '</div>';
                });
            } else {
                errorList += '<div>' + this.msg + '</div>';
            }
            this.msg = errorList;
        },
        showToastrMsg: function () {
            toastr[this.msgType](this.msg, this.msgTitle, {
                closeButton: true,
                tapToDismiss: false,
                rtl: 'rtl'
            });
            return this;
        },
        showInfo: function (msg) {
            this.msgType = "info";
            this.msgTitle = "Message!";
            this.msg = msg;
            this.showToastrMsg();
        },
        showError: function (msg) {
            this.msgType = "error";
            this.msgTitle = "Error!";
            this.msg = msg;
            this.showToastrMsg();
        },
        showSuccess: function (msg) {
            this.msgType = "success";
            this.msgTitle = "Success!";
            this.msg = msg;
            this.showToastrMsg();
        },
        showWarning: function (msg) {
            this.msgType = "warning";
            this.msgTitle = "Warning!";
            this.msg = msg;
            this.showToastrMsg();
        },
        showNoTimeout: function () {
            if (this.msgType === "error") {
                this.getError();
            }
            iziToast.show({
                title: this.msgTitle,
                message: this.msg,
                icon: this.msgToastrType[this.msgType],
                position: 'topRight',
                backgroundColor: '',
                theme: 'light', // dark
                color: this.txtColor[this.msgType], // blue, red, green, yellow
                progressBar: false,
                timeout: 0,
            });
            return this;
        },
        showErrorNoTimeout: function (msg) {
            this.msgType = "error";
            this.msgTitle = "Error!";
            this.msg = msg;
            this.showNoTimeout();
        },
        showSuccessNoTimeout: function (msg) {
            this.msgType = "success";
            this.msgTitle = "Success!";
            this.msg = msg;
            this.showNoTimeout();
        },
        confirmAction: function () {
            var self = this;
            var promiseObj = new Promise(function (resolve, reject) {
                iziToast.question({
                    timeout: 20000,
                    close: false,
                    overlay: true,
                    displayMode: 'once',
                    id: 'question',
                    zindex: 99999999,
                    title: 'Confirm: ',
                    message: self.msg,
                    position: 'topCenter',
                    timeout: 0,
                    buttons: [
                        ['<button>Yes</button>', function (instance, toast) {

                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            resolve(true);

                        }],
                        ['<button><b>NO</b></button>', function (instance, toast) {

                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            resolve(false);
                        }, true],
                    ],
                });
            });
            return promiseObj;
        },

        DeleteConfirm: function (title,msg) {
            var self = this;
            var promiseObj;

            var promiseObj = new Promise(function (resolve, reject) {
                Swal.fire({
                    title: title,
                    text: msg,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    customClass: {
                        confirmButton: 'btn btn-danger',
                        cancelButton: 'btn btn-outline-danger ml-1'
                    },
                    buttonsStyling: false
                }).then(function (result) {
                    if (result.value) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Your data has been deleted.',
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        });
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal.fire({
                            title: 'Cancelled',
                            text: 'Your data file is safe :)',
                            icon: 'error',
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        });
                    }
                    resolve(result.value)
                });
        });

            //var promiseObj = new Promise(function (resolve, reject) {
            //    iziToast.question({
            //        timeout: 20000,
            //        close: false,
            //        overlay: true,
            //        displayMode: 'once',
            //        id: 'question',
            //        zindex: 99999999,
            //        title: 'Confirm: ',
            //        message: self.msg,
            //        position: 'topCenter',
            //        timeout: 0,
            //        buttons: [
            //            ['<button>Yes</button>', function (instance, toast) {

            //                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            //                resolve(true);

            //            }],
            //            ['<button><b>NO</b></button>', function (instance, toast) {

            //                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            //                resolve(false);
            //            }, true],
            //        ],
            //    });
            //});
            return promiseObj;
        },
        
    }
    Message.init.prototype = Message.prototype;
    return global.Message = global.$M = Message;
}(window, $));