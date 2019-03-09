$(function() {

    /* form */
    $('#yesdata').change(function () {
        if (this.checked) {
            $('#my-submit').prop('disabled', false);
        } else {
            $('#my-submit').prop('disabled', true);
        }
    });

    $('#cost').change(function () {
        if ($('#cost').val() == 'Інше') {
            $('#cost-other').show("slow");
        } else $('#cost-other').hide("slow");
        console.log($('#cost').val());
    });

    $('.no-check').on('click', function () {
        $('.zmi-block, .other-block').hide("slow")
    })
    $('#check_zmi').on('click', function () {
        $('.zmi-block').show("slow");
        $('.other-block').hide("slow");
    });
    $('#check_other').on('click', function () {
        $('.other-block').show("slow");
        $('.zmi-block').hide("slow");
    });

/*end form*/
    
    

});