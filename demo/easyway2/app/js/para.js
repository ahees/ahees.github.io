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

	


	//Chrome Smooth Scroll
	try {
		$.browserSelector();
		if($("html").hasClass("chrome")) {
			$.smoothScroll();
		}
	} catch(err) {

	};

	$("img, a").on("dragstart", function(event) { event.preventDefault(); });

	

	$(".testpara").paroller();
	$(".title_parallax").paroller();
		$(window).paroller({ factor: '0.5', type: 'background', direction: 'verical' });





}); 
