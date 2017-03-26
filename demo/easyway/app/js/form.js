//после загрузки веб-страницы
$(function() {
   //при отправке формы messageForm на сервер (id="save")
  $('#save').click(function() {
     
    //отменить стандартное действие браузера
    //event.preventDefault();
    //завести переменную, которая будет говорить о том валидная форма или нет
    var formValid = true;
    //перебирает все элементы управления формы (input и textarea) 
    //$('input').each(function() {
      //если этот элемент капча, то пропустить его проверку
      //if ($(this).attr('id') == 'text-captcha') { return true; }
      ////найти предков, имеющих класс .form-group (для установления success/error)
      //var formGroup = $(this).parents('.form-group');
      //найти glyphicon (иконка успеха или ошибки)
      //var glyphicon = formGroup.find('.form-control-feedback');
      //валидация данных с помощью HTML5 функции checkValidity
     // if (this.checkValidity()) {
        //добавить к formGroup класс .has-success и удалить .has-error
      //  formGroup.addClass('has-success').removeClass('has-error');
        //добавить к glyphicon класс .glyphicon-ok и удалить .glyphicon-remove
     //   glyphicon.addClass('glyphicon-ok').removeClass('glyphicon-remove');
     // } else {
        //добавить к formGroup класс .has-error и удалить .has-success
    // 	formGroup.addClass('has-error').removeClass('has-success');
	    //добавить к glyphicon класс glyphicon-remove и удалить glyphicon-ok
	   // glyphicon.addClass('glyphicon-remove').removeClass('glyphicon-ok');
	    //если элемент не прошёл проверку, то отметить форму как не валидную 
	   // formValid = false;  
    //  }
   // });



    //проверяем элемент, содержащий код капчи
    //1. Получаем значение элемента input, содержащего код капчи
    //var captcha = $("#text-captcha").val();
    //2. Если длина кода капчи, которой ввёл пользователь не равно 6,
	//   то сразу отмечаем капчу как невалидную (без отправки на сервер)
   // if (captcha.length!=6) {
	  // получаем элемент, содержащий капчу
     // inputCaptcha = $("#text-captcha");
	  //найти предка, имеющего класс .form-group (для установления success/error)
     // formGroupCaptcha = inputCaptcha.parents('.form-group');
	  //найти glyphicon (иконка успеха или ошибки)
    //  glyphiconCaptcha = formGroupCaptcha.find('.form-control-feedback');
	  //добавить к formGroup класс .has-error и удалить .has-success
    //  formGroupCaptcha.addClass('has-error').removeClass('has-success');
	  //добавить к glyphicon класс glyphicon-remove и удалить glyphicon-ok
   //   glyphiconCaptcha.addClass('glyphicon-remove').removeClass('glyphicon-ok');
   // }
    // форма валидна и длина капчи равно 6 символам, то отправляем форму на сервер (AJAX)
    if (formValid) {
        $("#ajax_loader").addClass('').removeClass('hidden');
	  //получаем имя, которое ввёл пользователь	
	  var name = $("#name").val();
        //console.log(name);
	  //получаем email, который ввёл пользователь
      var phone = $("#phone").val();
        //console.log(phone);
	  //получаем сообщение, которое ввёл пользователь
      var message = $("#message").val();
        //console.log(message);
	  //получаем капчу, которую ввёл пользователь
      
	  //отправляем данные на сервер (AJAX)
      $.ajax({
		//метод передачи запроса - POST
        type: "POST",
		//URL-адрес запроса 
        url: "./verify.php",
		//передаваемые данные
        data: "name=" + name + "&phone=" + phone + "&message=" + message,
		//при успешном выполнении запроса
        success : function(text){
		  //если получен ответ success, то значит данные отправлены
          if (text == "success"){
            $("#ajax_loader").addClass('hidden').removeClass('');
            $("#save").hide();
            $(".close[data-dismiss=modal]").html("Закрыть");
            $("#myForm").trigger('reset');
            //$("#myForm").html("<h2>Спасибо!</h2><div>Наши консультанты перезвонят Вам в ближайшее время.</div>");
            //$("#myForm").html("<h2 style='color: black;'>Спасибо!</h2><div style='color: black;'>Мы свяжемся с Вами в ближайшее время!</div>");
            $("#myForm").hide();
            $('#messageForm').show();
            $(".close[data-dismiss=modal]").click(function(){
              $('#messageForm').hide();
              $("#myForm").show();
            });
			//скрыть форму обратной связи
            //$('#messageForm').hide();
			//удалить у элемент, имеющего id msgSubmit, класс hidden
            //$('#msgSubmit').removeClass('hidden');
          }
		  //если пришёл ответ invalidcaptcha, то делаем следующее...
	      
        }
      });
	}	 
  });
});
