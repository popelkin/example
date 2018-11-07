$(document).ready(function () {
    //
    var $dtabsorg = $('.dtabberorg'),
        $aorg = $dtabsorg.find('.dtabs a'),
        $divsorg = $dtabsorg.find('.dtext > div');
    $aorg.bind('click', function () {
        var $t = $(this);
        $aorg.removeClass('selected');
        $t.addClass('selected');
        $divsorg.removeClass('selected');
        $divsorg.filter('[data-id="' + $t.data('id') + '"]').addClass('selected');
    });
    ///

    //
    var $dcarousel41 = $(".dcarousel.partners");
    if ($dcarousel41.length) {
        $dcarousel41.owlCarousel({
            autoHeight: true,
            slideSpeed: 900,
            navigation: true,
            navigationText: ["", ""],
            singleItem: false,
            items: 3,
            autoPlay: $dcarousel41.find('.ditem').length > 3 ? 7000 : 10000,
            pagination: false,
            stopOnHover: true,
            onRefresh: function () {
                $dcarousel41.removeClass('onload');
            },
        });
    }
    ///

    //
    $(document).on('click', '.open_doctors', function () {
        $(this).parents('.clinic').find('.clinic_doctors').slideToggle(500);
        $(this).slideUp(500);
    });
    ///
});

function initPricelistSearch() {
    var $dpricelist = $('.dcitiesprices');

    if (!$dpricelist.length) {
        return false;
    }

    $('.dcitiesprices .daccardion .dcaption').unbind('click').bind('click', function () {
        var $t = $(this),
            $dtext = $t.next('.dtext'),
            $daccardion = $t.closest('.daccardion');
        $t.toggleClass('active');
        $dtext.toggleClass('active');
        if ($t.closest('.dcaption.l1').hasClass('active')) {
            $daccardion.addClass('active');
        } else {
            $daccardion.removeClass('active');
        }
    });

    var $dpricesearch = $dpricelist.find('.dpricesearch'),
        $input = $dpricesearch.find('input'),
        $button = $dpricesearch.find('a'),
        $daccardion = $dpricelist.find('.daccardion'),
        $dcaption = $daccardion.find('.dcaption'),
        $dtext = $daccardion.find('.dtext'),
        $tr = $daccardion.find('tbody tr'),
        $dmessage = $dpricelist.find('.dmessage');
    $button.bind('click', function () {
        var text = $input.val(),
            flag = false;
        $button.html('<i class="fa fa-spinner fa-pulse"></i>');
        $dmessage.addClass('hidden');
        $tr.removeClass('hidden');
        $daccardion.removeClass('hidden');
        $daccardion.removeClass('active');
        $dcaption.removeClass('hidden');
        $dcaption.removeClass('active');
        $dtext.removeClass('active');
        if (text.length) {
            $tr.addClass('hidden');
            $tr.filter(':Contains(' + text + ')').removeClass('hidden');
            $dtext.each(function () {
                var $t = $(this),
                    found = $t.find('tbody tr:not(.hidden)').length;
                if (found) {
                    $t.addClass('active');
                    $t.prev('.dcaption').addClass('active');
                    $t.closest('.daccardion').addClass('active');
                    flag = true;
                } else {
                    $t.prev('.dcaption').addClass('hidden');
                }
            });
        } else {
            flag = true;
        }
        $button.html('search');
        if (!flag) {
            $dmessage.removeClass('hidden');
            $daccardion.addClass('hidden');
        }
    });
    $input.on('keyup', function (e) {
        if (e.keyCode == 13) {
            $button.trigger('click');
        }
    });
}

function initLmkCheckForms() {
    $.base64.utf8encode = true;
    var $div = $('#ajs-dlmkcheckforms');

    if (!$div.length) {
        return false;
    }

    for (var i = 0; i <= 0; i++) {
        $.ajax({
            type: 'GET',
            data: {
                type: 'lmkforminit',
                number: i,
            },
            dataType: 'json',
            url: '/projectfactory/ajax/?debug',
            success: function (response) {
                var $d = $('<div class="dinner" />'),
                    $res = $($.base64.atob(response.data, true));
                $d.html($res);
                $div.append($d);
            },
        });
    }

    $div.on('submit', 'form', function (e) {
        var $form = $(e.currentTarget),
            $inputs = $form.find('input[type="text"]'),
            flag = true;
        $inputs.each(function () {
            var $t = $(this);
            if (!$t.val().trim()) {
                flag = false;
                return false;
            }
        });

        $.ajax({
            type: 'GET',
            url: 'https://diamedclinic.ru/projectfactory/ajax/?type=lmkformrequest&' + $form.serialize(),
            dataType: 'json',
            success: function (response) {
                $res = $($.base64.atob(response.data, true));
                $form.html($res);
            },
        });

        return false;
    });
}