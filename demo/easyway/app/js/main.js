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









}); 