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

	$('.parallax-window').parallax({
		imageSrc: './img/bg1_min.jpg',
		//imageSrc: '/images/bg.jpg',
		speed: 0.2,
	});
	$('.parallax-window-head').parallax({
		imageSrc: '/images/bg.jpg',
		speed: 0.1
	});









}); 