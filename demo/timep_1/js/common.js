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
$( "input,textarea" ).focusin(function() {
	console.log($(this).next("label").hide())
	// $( this ).next( "span" ).css( "display", "inline" ).fadeOut( 1000 );
});
$( "input,textarea" ).blur(function() {
	if ($(this).val() === '') {
		console.log($(this).next("label").show())
	}
	// $( this ).next( "span" ).css( "display", "inline" ).fadeOut( 1000 );
});
$(document).ready(function(){
  // $('.phone').inputmask("99-9999999");  //static mask
  $('.phone').inputmask({"mask": "+38(999) 999-99-99", "showMaskOnHover": false, "showMaskOnFocus": false}); //specifying options
  // $(selector).inputmask("9-a{1,3}9{1,3}"); //mask with dynamic syntax
});

$(window).on("load resize",function(e){
	var h_header = $('header').height();
	$('#mmenu').css('top', h_header)

	if ($('.swiper-doctor .item .details').length != 0) {

		$('.swiper-doctor .item .details').each(function(index,value) {
			var h = $('.hid', this).height()
			$(this).css('transform', 'translateY('+h+'px)')
			$('.hid', this).css('transform', 'translateY('+h+'px)')
		})
	}

});
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



const swiper_likar = new Swiper(".swiper-doctor-id", {
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
			slidesPerView: 1,
			// navigation: false
		},
		// when window width is >= 480px
		600: {
			slidesPerView: 2,
			// navigation: false
		},
		769: {
			slidesPerView: 2.25,
			pagination: false
		},
		800: {
			slidesPerView: 2.5,
			pagination: false
		},
		// when window width is >= 640px
		900: {
			slidesPerView: 3,
			pagination: false
		},
		1200: {
			slidesPerView: 4,
			// navigation: false,
			pagination: false
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



	$('#mmenu-menu').on('click','a.item-title.parent', function(e) {
		e.preventDefault();
		if ( $(this).next().hasClass('item-content') ) {
			if ( !$(this).parent().hasClass('active') ) {
				$(this).parent().addClass('active')
				$(this).next().addClass('active')
				$("#mmenu-menu > .list-menu > .menu-item").each(function(k,v){
					if( !$(v).hasClass('active') ) {
						$(v).addClass('disable')
					}
				});
				$(".menu_back").css('opacity',1)

		}
	}
	$('.menu_back').one('click', function(e){
		e.preventDefault();
		$("#mmenu-menu > .list-menu > .menu-item.disable").removeClass('disable')
		$("#mmenu-menu .active").removeClass('active')
		$(this).css('opacity',0)
	})

})