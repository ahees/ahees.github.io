$(function() {

	// Custom JS
	function heightDetect() {
		$(".auto_height").css("height", $(window).height());
	};
	heightDetect();
	$(window).resize(function() {
		heightDetect();
});
});
