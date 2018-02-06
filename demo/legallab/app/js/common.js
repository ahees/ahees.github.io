$(function() {

	// Custom JS
	//uk-scrollspy="cls: uk-animation-fade; target: > div > .uk-card; delay: 500; repeat: true"
	UIkit.scrollspy('#section-what-grid', {
	    cls: 'uk-animation-fade',
	    target: '> div > .uk-card',
	    delay: 250,
	    repeat: true
	});	
	//uk-scrollspy="cls: uk-animation-scale-up; repeat: true"
	UIkit.scrollspy('#section-plate-grid', {
		cls: 'uk-animation-scale-up',
		target: '> div > .plate-item',
		//delay: 500,
		repeat: true
	});	
	UIkit.scrollspy('.section-bb-box', {
	    cls: 'uk-animation-fade',	    
	    //delay: 400,
	    repeat: true
	});
	UIkit.scrollspy('.section-bb-img', {
	    cls: 'uk-animation-fade',	    
	    //delay: 300,
	    repeat: true
	});
	UIkit.scrollspy('.box-square-anm', {
	    cls: 'uk-animation-fade',	    
	    //delay: 300,
	    repeat: true
	});	
	
});

