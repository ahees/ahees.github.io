$(function() {

	function heightDetect() {
		$(".header").css("height", $(window).height());
	};
	heightDetect();
	$(window).resize(function() {
		heightDetect();
	});

	$('.parallax-window').parallax({imageSrc: '/images/bg.jpg'});

});
