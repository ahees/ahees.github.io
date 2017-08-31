$(function() {


		$('.program-item', this).each(function() {
		// найти высоту элемента
		var height = $(this).height();
		$(this).find('.program-time').css('height', height).css('line-height', height + 'px');
		
		});

		
		// найти высоту элемента
		var width = $('.program-time').width();
		// console.log(width);
		$(this).find('.program-block-line').css('left', (width/2)-2 + 'px');


    

});



