<?php
	//MAKE SURE THERE ARE NO DUPLICATE EMAILS
	require_once("DBQuery.php");
	$name = $_POST['nameActual'];
	$email = $_POST['email2'];
	$password = md5($_POST['password2']);
	$query = "INSERT INTO `user`(`name`, `email`, `password`) VALUES ('".$name."','".$email."','".$password."');";
	$register = new DBQuery($query);
	$register->execute_query();
	echo 'SUCCESS!!';
	header("Location: index.php");
?>
