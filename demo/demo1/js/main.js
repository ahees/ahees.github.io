$(function() {

	// Custom JS
	function heightDetect() {
		$(".head, .par_wrapper").css("height", $(window).height());
	};
	heightDetect();
	$(window).resize(function() {
		heightDetect();
		//$(".parallax-mirror").css("top", 0);
	});

	//$(".parallax-mirror").css("top", 0);

	$('.parallax-window').parallax({
		imageSrc: '/images/DSC03952.JPG',
		//imageSrc: '/images/bg.jpg',
		speed: 0.2,
	});
	$('.parallax-window-head').parallax({
		imageSrc: '/images/bg.jpg',
		speed: 0.1
	});

	/*random logo*/
	var arr = ['0.png','1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpg','13.jpg','14.jpg','15.jpg','16.jpg'];

	shuffle(arr);

	for (var i = 0; i < arr.length; i++) {      
		var div = document.createElement('div');
		div.className = 'col-md-2 col-sm-4 col-xs-4';      
		div.innerHTML = '<div class="items_item"><img src="images/'+arr[i]+'" alt="partners" /></div>';
		document.getElementById('partners').appendChild(div)
	}
	/*end random logo*/










});


  function up() {
    var top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
   if(top > 0) {
    window.scrollBy(0,((top+100)/-10));
    t = setTimeout('up()',40);
   } else clearTimeout(t);
   return false;
  }

 function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {

		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}







//   var banner = new Array('photo_1.jpg','photo_2.jpg','photo_3.jpg','photo_4.jpg','photo_5.jpg');
// /* считаем количество элементов в массиве с помощью оператора javascript - lenght */
// var count = banner.length;

// var random = Math.floor(Math.random()*count);
// /* выводим случайный элемент (в нашем случае - случайную картинку из директории /img/ ) */
// document.write('<a href="#" />'+banner[random]+'</a>');




// var arr = [1, 2, 3, 4, 5];

// function compareRandom(a, b) {
//   return Math.random() - 0.5;
// }

// arr.sort(compareRandom);

// //alert( arr );

// var a = ['photo_1.jpg','photo_2.jpg','photo_3.jpg','photo_4.jpg','photo_5.jpg']

// function compareRandom(a, b) {
//   return Math.random() - 0.5;
// }
// a.sort(compareRandom);

// for (var i = 0; i < a.length; i++) {
// 	document.write('<a href="#" />'+a[i]+'</a>');	
// }