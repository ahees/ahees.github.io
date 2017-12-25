$(function() {

	// Custom JS
	UIkit.scrollspy('.speak-box-grid', {
		cls: 'uk-animation-slide-bottom',
		target: '> div > .speak-item',
		delay: 300,
		repeat: true		
	});

	var owl = $('.carousel-feedback');
	owl.owlCarousel({
  		loop:true,
	    //margin:10,
	    //nav:true,
	    responsive:{
	        0:{
	            items:1
	        },
	        600:{
	            items:1
	        },
	        1000:{
	            items:1
	        }
	    }
  	});

  	$('#chevron-right').click(function() {
	    owl.trigger('next.owl.carousel');
	});

	$('#chevron-left').click(function() {
	    owl.trigger('next.owl.carousel');
	})


});
