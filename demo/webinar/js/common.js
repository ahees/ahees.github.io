$(function() {

	UIkit.scrollspy('.section-title', {
		cls: 'uk-animation-fade',
		// repeat: true
	});

	UIkit.scrollspy('.header-left, .program ul', {
		cls: 'uk-animation-slide-bottom',
		// repeat: true
	});
	UIkit.scrollspy('.header-right', {
		cls: 'uk-animation-slide-top',
		// repeat: true
	});
	UIkit.scrollspy('.speaker-img', {
		cls: 'uk-animation-slide-left',
		// repeat: true
	});
	UIkit.scrollspy('.speaker-text', {
		cls: 'uk-animation-slide-right',
		// repeat: true
	});
	UIkit.scrollspy('.promo-grid', {
		target: '.promo-item',
		cls: 'uk-animation-fade',
		// repeat: true,
		delay: 200
	});
	
	
	

});

function heightDetect() {
	var window_width = $(window).width();
	var container_width = $('.footer .uk-container').width();		
	var vline1 = (window_width - container_width) / 2;
	$('.vertical-line').css('opacity', 1);
	$('.vertical-line li:first-child').css('left', vline1);
	$('.vertical-line li:last-child').css('right', vline1);
	$('.vertical-line li:nth-child(2)').css('left', ((window_width / 2) + vline1) / 2);
	$('.vertical-line li:nth-child(4)').css('right', ((window_width / 2) + vline1) / 2);
	$('.vertical-line li:nth-child(3)').css('left', window_width / 2);
};

$(window).resize(function () {
	heightDetect();
});