$(function() {

	// Custom JS
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
		imageSrc: './img/bg2_min.jpg',
		speed: 0.1
	});
	
	$(".owl-carousel").owlCarousel({
	    loop:true,	    
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
	            items:1
	            
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







}); 