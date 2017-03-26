<?php
//открывает сессию
session_start();
$name = htmlspecialchars($_POST["name"]); // пишeм дaнныe в пeрeмeнныe и экрaнируeм спeцсимвoлы
$phone = htmlspecialchars($_POST["phone"]);
$message = htmlspecialchars($_POST["message"]);

if ($_SESSION["code"] == $_POST["captcha"]) {
    $emailgo = "fdsparta@gmail.com"; //куда отправлять письмо
    $subject = "Заказ обратного звонка";
    
    $mailmessage = "-------------------<br>";// текст сообщения
    $mailmessage .= "<b>Имя:</b> ".$name."<br>";
    $mailmessage .= "<b>Телефон:</b> ".$phone."<br>";
    $mailmessage .= "<b>Сообщение:</b><br>".$message."<br>";
    
    $mailheaders = "Content-type:text/html;charset=windows-1251rn";
    $mailheaders .= "From: SiteRobot <easywayrn"; 
    $mailheaders .= "Reply-To: noreply@siterobot.rurn"; 
    
    $success = mail($emailgo, $subject, $mailmessage, $mailheaders);
    
    

   
    
    
    
    
    
    
  if ($success) {
    echo "success";
  }
  //иначе отправляем "invalid"
  else {
    echo "invalid";
  }
}
else {
  //если пользователь ввёл неправильную капчу, то отправляем "invalidcaptcha"
  echo 'invalidcaptcha';
}