$(function() {

	// Custom JS
	$('#pagepiling').pagepiling({
	    menu: null,
        direction: 'vertical',
        verticalCentered: true,
        sectionsColor: [],
        anchors: [],
        scrollingSpeed: 700,
        easing: 'swing',
        loopBottom: false,
        loopTop: false,
        css3: true,
        navigation: {
            'textColor': '#000',
            'bulletsColor': '#000',
            'position': 'right',
            'tooltips': ['section1', 'section2', 'section3', 'section4']
        },
       	normalScrollElements: null,
        normalScrollElementTouchThreshold: 5,
        touchSensitivity: 5,
        keyboardScrolling: true,
        sectionSelector: '.section',
        animateAnchor: false,

		//events
		onLeave: function(index, nextIndex, direction){},
		afterLoad: function(anchorLink, index){},
		afterRender: function(){},
	});


	$(".hamburger").click(function(){
		$(this).toggleClass("is-active");
		if($(".modal").css('display') == 'none') {
		$(".modal").fadeIn(300);
		
		} else {
			$(".modal").fadeOut(300);
		}
	});
	// $(".hamburger").click(function(){
	// 	$(this).toggleClass("is-active");
	// 	if ($(".modal").is(":visible")) {
	// 		$(".modal").css("opacity",".1");
	// 		$(".modal").fadeOut(600);
			
	// 	} else {
	// 		$(".modal").css("opacity","1");
	// 		$(".modal").fadeIn(600);
	// 	}
	// });
	

});

var app = new Vue({
  el: '#app',
  data: {
    logo: [
      { src: 'img/logo1.svg' },
      { src: 'img/logo2.svg' },
      { src: 'img/logo3.svg' },
      { src: 'img/logo4.svg' },
      { src: 'img/logo5.svg' },
      { src: 'img/logo6.svg' },
      { src: 'img/test1.svg' },
    ],
	logo_header: 'img/ny.jpg'
  },
    methods: {
    setlogo: function (a) {
      this.logo_header = a
    }
  }
})
