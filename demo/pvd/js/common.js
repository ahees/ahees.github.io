$(function() {	

	UIkit.util.on('#mmenu', 'show', function () {
		$(".hamburger").toggleClass("is-active");
	});
	UIkit.util.on('#mmenu', 'hide', function () {
		$(".hamburger").toggleClass("is-active");
	});

});