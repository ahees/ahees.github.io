$(function() {

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
		imageSrc: './img/bg1_min.jpg',
		//imageSrc: '/images/bg.jpg',
		speed: 0.2,
	});
	$('.holidays').parallax({
		imageSrc: './img/bg6_min.jpg',
		speed: 0.1
	});
	$('#holidayskids').parallax({
		imageSrc: './img/bg2_min.jpg',
		speed: 0.1
	});
	$('#light').parallax({
		imageSrc: './img/bg5_min.jpg',
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

	$(".top_menu .menu a").mPageScroll2id();


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
	$(".top_menu .menu a").on("click", function(){
		$('.top_menu .menu').hide();
	});

});

