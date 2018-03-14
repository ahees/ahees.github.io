$(function() {

	$('.toggle').click(function(e) {
  	e.preventDefault();
  
    var $this = $(this);
  
    if ($this.next().hasClass('show')) {
        $this.next().removeClass('show');
        $this.find('.answer-icon span').css('transform','rotate(0deg)');
        $this.next().slideUp(350); 
        // console.log('if')      
    } else {
    	$this.parent().parent().find('.answer-icon span').css('transform','rotate(0deg)');
        $this.parent().parent().find('li .inner').removeClass('show');               
        $this.find('.answer-icon span').css('transform','rotate(-90deg)');
        $this.parent().parent().find('li .inner').slideUp(350);
        $this.next().toggleClass('show');
        $this.next().slideToggle(350);
        // console.log('else')
    }
	});

});
