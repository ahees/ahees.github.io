$(function() {

	// Custom JS
	function heightDetect() {
		$(".auto_height").css("height", $(window).height());
	};
	heightDetect();
	$(window).resize(function() {
		heightDetect();
	});

	$('.parallax-window').parallax({
		imageSrc: '/img/bg1_top-min.jpg',
		//imageSrc: '/images/bg.jpg',
		speed: 0.2,
	});
	$('.easyway_holidays').parallax({
		imageSrc: '/img/bg2-min.jpg',
		//imageSrc: '/images/bg.jpg',
		speed: 0.2,
	});
	
});
