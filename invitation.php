<?php
$name = $_POST['name'];
$to = $_POST['emailto'];
$from = $_POST['emailfrom'];
$subject = "Invitation from ".$name;
$message = "Hi ".$to." join me Awesome Ping Pong Game.";
mail($to, $subject, $message);
?>