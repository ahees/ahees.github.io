$(function() {

	var link_k = $('#new-user .user-kiev'),
		link_r = $('#new-user .user-region');

	link_k.on('click', function(){
		console.log('kiev');
	});
	link_r.on('click', function () {
		console.log('not kiev');
	});


	$('.news-carousel').owlCarousel({
		margin: 25,
		center: true,
		items: 2,
		loop: true,
		autoplay: true,
		margin: 10,
		responsive: {
			320: {
				items: 1
			},
			480: {
				items: 2
			}
		}
	});

	UIkit.util.on('#mmenu', 'show', function () {
		$('#nav-icon3').toggleClass('open');
	});
	UIkit.util.on('#mmenu', 'hide', function () {
		$('#nav-icon3').toggleClass('open');
	});

	UIkit.scrollspy('.section-title', 
		{
			cls: "uk-animation-fade",
			delay: 200,
			// repeat: true
		}
	);
	UIkit.scrollspy('.about-box, .default-wrapper, .news-box, .team-wrapper',
		{
			cls: "uk-animation-fade",
			delay: 100,
			// repeat: true
		}
	);
	UIkit.scrollspy('.header1_bg',
		{
			cls: "uk-animation-slide-left",
			delay: 100,
			// repeat: true
		}
	);
	UIkit.scrollspy('.header1_content',
		{
			cls: "uk-animation-slide-right",
			delay: 100,
			// repeat: true
		}
	);
	//header1_bg//header1_content

// 	UIkit.scrollspy(".index .alist2-grid div:nth-child(even) .alist2-item", { cls: "uk-animation-slide-right-medium", delay: 200, repeat: !0 }), UIkit.scrollspy(".pspeak-img", { cls: "uk-animation-slide-left-medium", delay: 200, repeat: !0 }), UIkit.scrollspy(".speak-box .uk-card", { cls: "uk-animation-slide-right-medium", delay: 200, repeat: !0 }), heightDetect()
// }), $(window).resize(function () { heightDetect() });

	// $('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function () {
	// 	$(this).toggleClass('open');
	// });

});
