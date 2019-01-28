$(function() {


    // var bgslider = $('.active .slider-item').css('background-image');
    // $('.hero-block').css('background-image', bgslider);

    


    var owl = $('.slider-box');
    owl.owlCarousel({
        loop: true,
        // margin: 10,
        // nav: true,
        autoplay: true,
        animateOut: 'fadeOut',
        // dots: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });

    UIkit.scrollspy('.sec-title, .about-hero, .price-ner > p, .price-ner > h3, .price-r > p, .price-r > ul, .price-r > h3', {
        cls: "uk-animation-fade",
        delay: 200,
        repeat: true
    });
    UIkit.scrollspy('.paket-box > table, .team-box, .team-connect, .test-hero-sub', {
        cls: "uk-animation-slide-bottom-small",
        delay: 200,
        repeat: true
    });
    UIkit.scrollspy('.test-hero-title', {
        cls: "uk-animation-slide-top-small",
        delay: 200,
        repeat: true
    });

    UIkit.scrollspy('.about-box', {
        cls: "uk-animation-fade",
        target: "> div",
        delay: 400,
        repeat: true
    });
    
    
   

});
