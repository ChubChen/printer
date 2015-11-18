var FormValidation = function () {

    var handleValidation1 = function () {
        // for more info visit the official plugin documentation: 
        // http://docs.jquery.com/Plugins/Validation

        var form1 = $('#form_sample_1');
        var error1 = $('.alert-error', form1);
        var success1 = $('.alert-success', form1);

        var form2 = $('#form_sample_2');
        var error2 = $('.alert-error2', form2);
        var success2 = $('.alert-success2', form2);

        var form3 = $('#form_sample_3');
        var error3 = $('.alert-error3', form3);
        var success3 = $('.alert-success3', form2);

        form2.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-inline', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules:{
                pl3_input:{
                    required: true,
                    number:true
                },
                gpyx_input:{ required: true,
                    number:true},
                dlt_input:{ required: true,
                    number:true},
                qxc_input:{ required: true,
                    number:true},
                pl5_input:{ required: true,
                    number:true},
                jc_input:{ required: true,
                    number:true},
                prize:{ required: true,
                    number:true},
                start_sleep:{ required: true,
                    number:true},
                stop_sleep:{ required: true,
                    number:true}
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                success2.hide();
                error2.show();
                FormValidation.scrollTo(error2, -200);
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
                error2.hide();
               var data = {};
                data.cmd = form.attributes['action'].value;
                var bodyNode = {};
                data.bodyNode = bodyNode;
                var config = {};
                bodyNode.config = config;
                var elements = form.getElementsByTagName('input');
                var tempLength = elements.length;
                for (var i = 0; i < tempLength; i++) {
                    if (elements[i].name == '') {

                    } else {
                       if(elements[i].name == 'id' ){
                           bodyNode[elements[i].name] = elements[i].value;
                       }else if(!isNaN(elements[i]).value){
                           config[elements[i].name] = elements[i].value;
                       }
                    }
                };
               socket.emit('data', data);
               $("#" + data.cmd).modal('hide');
            }
        });

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
                },
                preAmount:{
                    number:true,
                    required:true
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

        form3.validate({
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
                },
                preAmount:{
                    number:true,
                    required:true
                },
                preAmount:{
                    required:true
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
                bodyNode.authority = [];
                var singleSelect = $(".chzn-single");
                var selecteds = $(".search-choice");
                if (selecteds.length !== 0) {
                    console.log(456);
                    // bodyNode.gameCode = {};
                    // for (var i = 0; i < selecteds.length; i++) {
                    //     var name = selecteds[i].getElementsByTagName('span')[0].innerText;
                    //     bodyNode.gameCode[getGameCode(name)] = name;
                    // }
                    // ;
                    for(var i=0; i<selecteds.length; i++){
                        bodyNode.authority.push(selecteds[i].getElementsByTagName('span')[0].innerText);   
                    }
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
                console.log(bodyNode.authority);
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

