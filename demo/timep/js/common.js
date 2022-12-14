// const search_button = document.querySelector('#nav-search')
// const header_search = document.querySelector('.header-search')
// search_button.addEventListener('click', (e) => {
// 	e.preventDefault()
// 	header_search.classList.toggle('none');
// })
// document.addEventListener('click', (e) => {
// 	if (e.target !== search_button && !header_search.classList.contains('none') && !e.target.classList.contains('header-search')) {
// 		header_search.classList.add('none')
// 		console.log('add none search')
// 	}

// })
const swiper_lead = new Swiper("#swiper-lead", {
	// Optional parameters
	loop: true,
	slidesPerView: 1,
	spaceBetween: 0,
	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
	}

});

var swiper1 = new Swiper("#swiper-service, #swiper-directions", {
	slidesPerView: 4,
	grid: {
		rows: 2,
		fill: "row"
	},
	spaceBetween: 10,
	pagination: {
		el: ".swiper-pagination",
		clickable: true
	},
	breakpoints: {
		// when window width is >= 320px
		300: {
			slidesPerView: 2,
			grid: {
				rows: 2,
				fill: "row"
			},
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
			}
		},
		// when window width is >= 480px
		640: {
			slidesPerView: 4,
			grid: {
				rows: 4,
				fill: "row"
			}
		}
	}
});

const swiperreviews = new Swiper(".swiper-reviews", {
	// Optional parameters
	loop: false,
	slidesPerView: "auto",
	spaceBetween: 10,
	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
	},
	navigation: {
		nextEl: '.swiperBtn-next',
		prevEl: '.swiperBtn-prev',
	},

	breakpoints: {
		// when window width is >= 320px
		300: {
			slidesPerView: 1
		},
		// when window width is >= 480px
		600: {
			slidesPerView: 2
		},
		// when window width is >= 640px
		900: {
			slidesPerView: 3
		},
		1200: {
			slidesPerView: 3
		}
	}
});

UIkit.util.on('#mmenu', 'show', function () {
	// do something
	console.log('show menu')
	if (!$(".mmenu").hasClass('active')) {
		$(".mmenu").addClass('active')
	}

});
UIkit.util.on('#mmenu', 'hide', function () {
	// do something
	console.log('hide menu')
	if ($(".mmenu").hasClass('active')) {
		$(".mmenu").removeClass('active')
	}
});