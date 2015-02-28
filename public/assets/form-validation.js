var FormValidation = function () {

    var handleValidation1 = function () {
        // for more info visit the official plugin documentation: 
        // http://docs.jquery.com/Plugins/Validation

        var form1 = $('#form_sample_1');
        var error1 = $('.alert-error', form1);
        var success1 = $('.alert-success', form1);

        form1.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-inline', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                terminalName: {
                    minlength: 2,
                    required: true
                },
                userName: {
                    minlength: 2,
                    required: true
                },
                passWord: {
                    minlength: 2,
                    required: true
                },
                id: {
                    minlength: 2,
                    required: true
                },
                digits: {
                    required: true,
                    digits: true
                },
                creditcard: {
                    required: true,
                    creditcard: true
                },
                occupation: {
                    minlength: 5
                },
                category: {
                    required: true
                }
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                success1.hide();
                error1.show();
                FormValidation.scrollTo(error1, -200);
            },
            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.help-inline').removeClass('ok'); // display OK icon
                $(element)
                    .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.control-group').removeClass('error'); // set error class to the control group
            },
            success: function (label) {
                label
                    .addClass('valid').addClass('help-inline ok') // mark the current input as valid and display OK icon
                    .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
            },
            submitHandler: function (form) {
                error1.hide();
                var data = {};
                data.cmd = form.attributes['action'].value;
                var bodyNode = {};
                data.bodyNode = bodyNode;
                var elements = form.getElementsByTagName('input');
                var tempLength = elements.length;
                for (var i = 0; i < tempLength; i++) {
                    if (elements[i].name == '') {
                    } else {
                        if (elements[i].name == 'gameCode') {
                            bodyNode.gameCode = {};
                            var arr = elements[i].value.split(',');
                            for (var j = 0; j < arr.length; j++) {
                                bodyNode.gameCode[arr[j]] = game[arr[j]];
                            }
                            ;
                        } else {
                            bodyNode[elements[i].name] = elements[i].value;
                        }
                        ;
                    }
                }
                ;

                var singleSelect = $(".chzn-single");
                var selecteds = $(".search-choice");
                if (selecteds.length != 0) {
                    bodyNode.gameCode = {};
                    for (var i = 0; i < selecteds.length; i++) {
                        var name = selecteds[i].getElementsByTagName('span')[0].innerText;
                        bodyNode.gameCode[getGameCode(name)] = name;
                    }
                    ;
                }
                else if (singleSelect.length != 0) {
                    for (var i = 0; i < singleSelect.length; i++) {
                        var name = singleSelect[i].getElementsByTagName('span')[0].innerText;
                        bodyNode.status = getStatusCode(name);
                    }
                    ;
                }
                else if (data.cmd == 'addUser') {

                } else {
                    $("#" + data.cmd).modal('hide');
                    return;
                }
                ;
                socket.emit('data', data);
                $("#" + data.cmd).modal('hide');
            }
        });
    }

    return {
        //main function to initiate the module
        init: function () {

            handleValidation1();

        },

        // wrapper function to scroll to an element
        scrollTo: function (el, offeset) {
            pos = el ? el.offset().top : 0;
            jQuery('html,body').animate({
                scrollTop: pos + (offeset ? offeset : 0)
            }, 'slow');
        }
    };
}();

