
$(function() {

	$("#phone").inputmask("+38(999)999-99-99");

	$("#fanketa").on('change', '.block-a', function () {
		var block_a = $(".block-a").serializeArray();

		if (block_a.length >= 5) {
			$(".block-a .next-block").addClass("active");
			console.log('блок а валидный');
		} else {
			$(".block-a .next-block").removeClass("active");
		}

		$(".block-a .next-block").on('click', function () {
			$(".block-a").fadeOut('slow', function () {
				console.log('скрываем блок А');
				$(".block-b").fadeIn('slow');
				$(".block-a .next-block").removeClass("active");
				console.log('открываем блок Б');
			});
		});
		return true;
		//console.log(block_a.length);
	});	
	$("#fanketa").on('change', '.block-b', function () {
		var block_b = $(".block-b").serializeArray();

		if (block_b.length >= 6) {
			$(".block-b .next-block").addClass("active");
			console.log('блок Б валидный');
		} else {
			$(".block-b .next-block").removeClass("active");
		}

		$(".block-b .next-block").on('click', function () {
			$(".block-b").fadeOut('slow', function () {
				console.log('скрываем блок Б');
				$(".block-c").fadeIn('slow');			
				$(".block-b .next-block").removeClass("active");
				console.log('открываем блок С');
			});
		});
		//console.log(block_a.length);
	});	

	$("#fanketa").on('change', '.block-c', function () {
		var block_c = $(".block-c").serializeArray();

		if (block_c.length >= 3) {
			$(".block-c .next-block").addClass("active");
			console.log('блок С валидный');
		} else {
			$(".block-c .next-block").removeClass("active");
		}

		$(".block-c .next-block").on('click', function () {
			$(".block-c").fadeOut('slow', function () {
				console.log('Скрываем блок С');
				$(".block-d").fadeIn('slow');
				$(".block-c .next-block").removeClass("active");
				
				console.log('показываем блок Д');
			});
		});
		//console.log(block_a.length);
	});	

	$("#fanketa").on('change', '.block-d', function () {

		var bname       = $("#name").val().length,
			bname_error = $("#name-error").html().length,
			bphone      = $("#phone").val().length,
			bphone_error= $("#phone-error").html().length, 
			bemail		= $("#email").val().length,
			bemail_error= $("#email-error").html().length;

		if ((bname > 5) & (bname_error == 0)) {
			alert('da');
		}

		var block_c = $(".block-c").serializeArray();

		if (block_c.length >= 3) {
			$(".block-c .next-block").addClass("active");
			console.log('блок С валидный');
		} else {
			$(".block-c .next-block").removeClass("active");
		}

		$(".block-c .next-block").on('click', function () {
			$(".block-c").fadeOut('slow', function () {
				console.log('Скрываем блок С');
				$(".block-d").fadeIn('slow');
				$(".block-c .next-block").removeClass("active");
				
				console.log('показываем блок Д');
			});
		});
		//console.log(block_a.length);
	});	

	$("#sub").on("click", function(e){
		e.preventDefault();
		var ddd = $('#fanketa').serializeArray();
	
		$.ajax({
			url: 'https://acity.one/anketa.php',
			//url: 'http://gen.test/anketa.php',
			//url: 'http://jobmax.server/anketa.php',
			type: 'post',
			data: ddd,
			success: function (result) {
				if (result == "da") {
					//$('#result').html(result);
					$("#fanketa").fadeOut('slow', function () {
			
						$(".result-anketa").fadeIn('slow');
						
					});
				} else {
					console.log('net');
				}
			}
		});

	});

	$(".sub-button1").on("click", function(e){
		e.preventDefault();
		$("#fanketa").fadeOut('slow', function () {
			
			$(".result-anketa").fadeIn('slow');
			
		});
	});

	


		$("#fanketa").validate({
			messages: {
				email: {
				required: "Поле email обязательно для заполнения",
				email: jQuery.validator.format("Введите корректный email")
				},
				name: {
				required: "Поле имя обязательно для заполнения",
				minlength: jQuery.validator.format("Длина имени должна быть больше 5-ти символов")
				}
			},
			rules: {
				name: {
					required: true,
					minlength: 5
				},
				email: {
					required: true,
					email: true
				}
				
			},
			
			//success: function() { alert("Submitted!") }
			//submitHandler: function() { alert("Submitted!") }


  
			
		});







});