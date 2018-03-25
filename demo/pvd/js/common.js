$(function() {	

	UIkit.util.on('#mmenu', 'show', function () {
		$(".hamburger").toggleClass("is-active");
	});
	UIkit.util.on('#mmenu', 'hide', function () {
		$(".hamburger").toggleClass("is-active");
	});

	var owl = $('.carousel-serv');
	owl.owlCarousel({
		loop:true,
		dots:false,
		autoHeight:true,
		autoplay:true,
		margin:10,
		responsiveClass:true,
		responsive:{
			0:{
				items:1,
				nav:false
			},
			600:{
				items:1,
				nav:false
			},
			1000:{
				items:1,
				nav:false				
			}
		}
	});
	$('#nextcarousel').click(function() {
		owl.trigger('next.owl.carousel');
	})
	// Go to the previous item
	$('#prevcarousel').click(function() {
		// With optional speed parameter
		// Parameters has to be in square bracket '[]'
		owl.trigger('prev.owl.carousel', [300]);
	})

});
