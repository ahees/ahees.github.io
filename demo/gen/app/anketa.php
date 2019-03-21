<?php
header('Access-Control-Allow-Origin: *');
$qaq1 = '1. Были ли в Вашей семье зарегистрированы случаи рака молочной железы у
родственников первой степени родства (мать, сестра, дочь) в возрасте до 50 лет?';
$qaq2 = '2. Были ли в Вашей семье зарегистрированы случаи рака молочной железы в
нескольких поколениях по одной линии (материнской или отцовской) или у
родственников, состоящих между собой в родстве первой степени?';
$qaq3 = '3. Были ли в Вашей семье зарегистрированы случаи рака яичников у родственников
первой степени родства (мать, сестра, дочь)?';
$qaq4 = '4. Были ли в Вашей семье зарегистрированы случаи рака молочной железы у мужчин?';
$qaq5 = '5. Были ли у кого-либо из Ваших родственников выявлены мутации гена BRCA1/
BRCA2?';

$qbq1 = '1. Были ли в Вашей семье зарегистрированы случаи рака молочной железы у
родственников второй степени родства (бабушка, тетя)?';
$qbq2 = '2. Были ли в Вашей семье зарегистрированы случаи рака маточной (фаллопиевой)
трубы?';
$qbq3 = '3. Были ли в Вашей семье зарегистрированы случаи первичного перитонеального
рака?';
$qbq4 = '4. Были ли в Вашей семье зарегистрированы случаи рака простаты?';
$qbq5 = '5. Были ли в Вашей семье зарегистрированы случаи рака поджелудочной железы?';
$qbq6 = '6. Были ли в Вашей семье зарегистрированы случаи анемии Фанкони?';

$qcq1 = '1. Хотели бы Вы пройти генетическое тестирование на наличие мутаций гена
BRCA1/BRCA2 ?';
$qcq2 = '2. Знаете ли Вы о преимуществах генетического тестирования методом NGS?';
$qcq3 = '3. Хотели бы Вы пройти генетическое консультирование и получить больше
информации о ?';

$aq1 = $_POST['aq1']; 
$aq2 = $_POST['aq2'];
$aq3 = $_POST['aq3']; 
$aq4 = $_POST['aq4'];
$aq5 = $_POST['aq5']; 
$bq1 = $_POST['bq1'];
$bq2 = $_POST['bq2']; 
$bq3 = $_POST['bq3']; 
$bq4 = $_POST['bq4']; 
$bq5 = $_POST['bq5']; 
$bq6 = $_POST['bq6']; 
$cq1 = $_POST['cq1']; 
$cq2 = $_POST['cq2']; 
$cq3 = $_POST['cq3']; 



// $to  = "fdsparta@gmail.com" ; 
$to  = "ahees@ex.ua" ; 

$subject = "Генетики - новая заявка";

$message =  "<b>$qaq1</b><br />";
$message .= "<i>$aq1</i><br />";

$message .=  "<b>$qaq2</b><br />";
$message .= "<i>$aq2</i><br />";

$message .=  "<b>$qaq3</b><br />";
$message .= "<i>$aq3</i><br />";

$message .=  "<b>$qaq4</b><br />";
$message .= "<i>$aq4</i><br />";

$message .=  "<b>$qaq5</b><br />";
$message .= "<i>$aq5</i><br />";

$message .=  "<b>$qbq1</b><br />";
$message .= "<i>$bq1</i><br />";

$message .=  "<b>$qbq2</b><br />";
$message .= "<i>$bq2</i><br />";

$message .=  "<b>$qbq3</b><br />";
$message .= "<i>$bq3</i><br />";

$message .=  "<b>$qbq4</b><br />";
$message .= "<i>$bq4</i><br />";

$message .=  "<b>$qbq5</b><br />";
$message .= "<i>$bq5</i><br />";

$message .=  "<b>$qbq6</b><br />";
$message .= "<i>$bq6</i><br />";

$message .=  "<b>$qcq1</b><br />";
$message .= "<i>$cq1</i><br />";

$message .=  "<b>$qcq2</b><br />";
$message .= "<i>$cq2</i><br />";

$message .=  "<b>$qcq3</b><br />";
$message .= "<i>$cq3</i><br />";



$header = "From:fdsparta@gmail.com \r\n";
$header .= "Cc:fdsparta@gmail.com \r\n";
$header .= "MIME-Version: 1.0\r\n";
$header .= "Content-type: text/html\r\n";

//$retval = mail ($to,$subject,$message,$header);

//if( $retval == true ) {
//    echo "Анкета отправлена";
//}else {
  //  echo "Message could not be sent...";
//}

//var_dump($_POST);

if (!empty($_POST['name'])) {
    // echo 'da';
    var_dump($_POST);
} else {
    var_dump($_POST);
    //echo 'net';
}

//header('Access-Control-Allow-Origin: *');
//var_dump($_POST);
// echo $_POST['aq3'].'----'.$_POST['aq1'];