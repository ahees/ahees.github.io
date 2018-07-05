$(function() {

	$(".owl-gastrol").owlCarousel({
		stagePadding: 75,
		loop: true,
		margin: 25,
		nav: false,
		responsive: {
			0: {
				items: 2,
				stagePadding: 0
			},
			700: {
				items: 2
			},
			1000: {
				items: 3
			}
		}
	});

	// $(".hamburger").click(function () {
	// 	$(this).toggleClass("is-active");
	// });

	UIkit.util.on('#mmenu', 'show', function () {
		$("#hamburger").toggleClass("is-active");
	});

	UIkit.util.on('#mmenu', 'hide', function () {
		$("#hamburger").toggleClass("is-active");
	});

	/* form */
	$('#yesdata').change(function () {
		if (this.checked) {
			$('#my-submit').prop('disabled', false);
		} else {
			$('#my-submit').prop('disabled', true);
		}
	});

	$('#cost').change(function () {
		if ($('#cost').val() == 'Інше') {
			$('#cost-other').show("slow");
		} else $('#cost-other').hide("slow");
		console.log($('#cost').val());
	});

	$('.no-check').on('click', function () {
		$('.zmi-block, .other-block').hide("slow")
	})
	$('#check_zmi').on('click', function () {
		$('.zmi-block').show("slow");
		$('.other-block').hide("slow");
	});
	$('#check_other').on('click', function () {
		$('.other-block').show("slow");
		$('.zmi-block').hide("slow");
	});

	/*end form*/
	
	UIkit.scrollspy('.header-main img', {
		cls: 'uk-animation-slide-top-medium',
		delay: 500,
		repeat: true
	});
	UIkit.scrollspy('.header-main div, .section-aboutd p', {
		cls: 'uk-animation-slide-bottom-medium',
		delay: 500,
		repeat: true
	});
	UIkit.scrollspy('.about-icons', {
		cls: "uk-animation-fade",
		target: "> .about-icon",
		delay: 400,
		repeat: true
	});
	UIkit.scrollspy('.index .h-title, .index .h-subtitle, .gastrol-content', {
		cls: "uk-animation-fade",		
		delay: 200,
		repeat: true
	});
	UIkit.scrollspy('.index .events-grid', {
		cls: "uk-animation-fade",
		target: "> .events-item-box",
		delay: 500,
		repeat: true
	});
	UIkit.scrollspy('.gastrol-gallery > div', {
		cls: "uk-animation-fade",
		target: "> div",
		delay: 500,
		repeat: true
	});

	UIkit.scrollspy('.index .alist2-grid div:nth-child(odd) .alist2-item', {
		cls: "uk-animation-slide-left-medium",
		delay: 200,
		repeat: true
	});
	UIkit.scrollspy('.index .alist2-grid div:nth-child(even) .alist2-item', {
		cls: "uk-animation-slide-right-medium",
		delay: 200,
		repeat: true
	});

	$(".emotion-feedback").on('click', function () {
		UIkit.accordion('.emotion-acc').toggle(0, true)
	});
	
	
	
	

	heightDetect ();

});

function heightDetect() {
	var window_width = $(window).width();
	var container_width = $('footer .uk-container').width();
	var vline1 = (window_width - container_width) / 2;
	$('.spotline').css('opacity', 1);
	$('.spotline li:first-child').css('left', vline1);
	$('.spotline li:last-child').css('right', vline1);
	$('.spotline li:nth-child(2)').css('left', ((window_width / 2) + vline1) / 2);
	$('.spotline li:nth-child(4)').css('right', ((window_width / 2) + vline1) / 2);
	$('.spotline li:nth-child(3)').css('left', window_width / 2);
};

$(window).resize(function () {
	heightDetect();
});
