$(window).on('load', function () {
	    var $preloader = $('#p_prldr'),
	        $svg_anm   = $preloader.find('.svg_anm');
	    $svg_anm.fadeOut();
	    $preloader.delay(500).fadeOut('slow');
});

$(function() {


	$("#gotop a").mPageScroll2id();
	function heightDetect() {
		$(".auto_height").css("height", ($(window).height()/1.5));
	};
	heightDetect();
	$(window).resize(function() {
		heightDetect();
		//$(".parallax-mirror").css("top", 0);
	});

	//$(".parallax-mirror").css("top", 0);

	$('.easyway').parallax({
		imageSrc: './img/min_bg1.jpg',
		//imageSrc: '/images/bg.jpg',
		speed: 0.1,
	});
	$('.holidays').parallax({
		imageSrc: './img/min_bg6.jpg',
		speed: 0.1
	});
	$('#holidayskids').parallax({
		imageSrc: './img/min_bg2.jpg',
		speed: 0.1
	});
	$('#light').parallax({
		imageSrc: './img/min_bg5.jpg',
		speed: 0.1
	});
	$('#order').parallax({
		imageSrc: './img/min_bg3.jpg',
		speed: 0.1
	});
	$('#order_2').parallax({
		imageSrc: './img/min_bg4.jpg',
		speed: 0.1
	});

	$(".owl-carousel").owlCarousel({
	    loop:true,	    
	    autoHeight: true,
	    responsiveClass:true,
	    responsive:{
	        0:{
	            items:1
	            
	        },
	        600:{
	            items:1,
	            nav:false
	        },
	        1000:{
	            items:2
	            
	        }
	    }
	});
	var owl = $('.owl-carousel');
	owl.owlCarousel();
	// Go to the next item
	$('.owl_right').click(function() {
	    owl.trigger('next.owl.carousel');
	})
	// Go to the previous item
	$('.owl_left').click(function() {
	    // With optional speed parameter
	    // Parameters has to be in square bracket '[]'
	    owl.trigger('prev.owl.carousel', [300]);
	})


	//Chrome Smooth Scroll
	try {
		$.browserSelector();
		if($("html").hasClass("chrome")) {
			$.smoothScroll();
		}
	} catch(err) {

	};

	$("img, a").on("dragstart", function(event) { event.preventDefault(); });

	$(".top_menu .menu a").mPageScroll2id({
		offset: 200
	});


	$('.feedback').magnificPopup({
        type: 'inline'		
    });

    $('.close').click(function(){
        $('.mfp-close').trigger('click');
     });

    $('.gallery_items').magnificPopup({
		delegate: 'a',
		type: 'image',
		tLoading: 'Загрузка изображения #%curr%...',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
		}
	});


	 $('.tooglebutton').on('click', function(){
        $('.menu').slideToggle(300, function(){

            if($(this).css('display') === 'none'){
              $(this).removeAttr('style');
            }


        });
	});
	console.log($(window).width());
	if ($(window).width() < 790) {
	$(".top_menu .menu a").on("click", function(){
		$('.top_menu .menu').hide();
	});
	}

});


$(window).scroll(function() {
    if ($(this).scrollTop() > 80){  
        //$('header').addClass("sticky");
        $('#gotop').css('opacity', '.8');
    }
    else{
        //$('header').removeClass("sticky");
        $('#gotop').css('opacity', '0');
    }
});