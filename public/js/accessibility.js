$(document).ready(function () {
    var is_tabbing = false,
        $popover = null;
    $('body').keydown(function (e) {
        // console.log('keyup called');
        var code = e.keyCode || e.which;
        if (code == '9') { //tab
            is_tabbing = true;
        }
    });
    var returnToPopoverLink = function () {
        var $btn = $('.popover').closest('.popover_container').find('.popover_btn');
        $popover = null;
        $btn.popover('hide');
        $btn.focus();
    };

    $('body').mouseup(function (e) {
        is_tabbing = false;
        $popover = null;
    });
    $(document).on('focus', "a, input, li, button", null, function (event) {
        if (is_tabbing) {
            if ($popover && !$.contains($popover[0], event.target)) {
                var $btn = $popover.find('.close-btn');
                $btn.focus();
                $btn.addClass("focused");
            } else {
                $(event.target).addClass("focused");
            }
        }
    }).on('blur', "*", null, function (event) {
            $(event.target).removeClass("focused");
    });

    $(document).on('focus', '.qq-uploader input', function(event){
        if (is_tabbing) {
            $(event.target).closest('.user_image').addClass("focused");
        }
    }).on('blur', ".qq-uploader input", null, function (event) {
        $(event.target).closest('.user_image').removeClass("focused");
    });

    $(document).on('focus', '.email_settings input', function(event){
        if (is_tabbing) {
            $(event.target).next('label').addClass("focused");
        }
    }).on('blur', ".email_settings input", null, function (event) {
        $(event.target).next('label').removeClass("focused");
    });
});

