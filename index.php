<?php
  $signedin = false;
  session_start();

  

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="assets/img/favicon.png">

    <title>Pong</title>

    <!-- Bootstrap core CSS -->
    <link href="assets/css/bootstrap.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="assets/css/main.css" rel="stylesheet">

    <!-- Fonts from Google Fonts -->
	<link href='http://fonts.googleapis.com/css?family=Lato:300,400,900' rel='stylesheet' type='text/css'>
    
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <!-- Fixed navbar -->
     
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="js/script.js"></script>
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href=".">Ultimate Pong</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">



          <!--====================================FORM====================================-->
          <form action="log.php" class="navbar-form navbar-right" method="POST">
            <div class="form-group">
              <input type="email" placeholder="Email" class="form-control" name="email" required>
            </div>
            <div class="form-group">
              <input type="password" placeholder="Password" class="form-control" name="password" required>
            </div>
            <button type="submit" class="btn btn-success">Sign in</button>
            <a role="button" href="register.php" class="btn btn-default">Register</a>
          </form>
          <?php
              //INVALID USERNAME, PASSWORD MESSAGE
              if (isset($_SESSION['invalid'])){
                print("<div class=\"container\"><div class=\"col-md-5 col-md-offset-4\"><div class=\"alert alert-danger\">The email or password is incorrect, or you'll need to sign up.</div></div>");
                unset($_SESSION['invalid']);
              }
            ?>
        </div><!--/.navbar-collapse -->
      </div>
    </nav>

	<div id="headerwrap">
		<div class="container">
			<div class="row">
      </div><!-- /col-lg-6 -->
        <div class="col-lg-3">
          <img class="img-responsive" src="assets/img/pingpang.jpg" alt="">
        </div><!-- /col-lg-6 -->
				<div class="col-lg-9">
        <div class="panel panel-default">
            <!-- Default panel contents -->
            <div class="panel-heading">TOP 3 ALL-TIME PONGERS</div>

            <!-- Table -->
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Wins</th>
                </tr>
              </thead>
              <tbody>
                <th scope="row">1</th>
                <th> Tyler </th>
                <th>7</th>
              </tbody>
              <tbody>
                <th scope="row">1</th>
                <th> Shawn </th>
                <th>7</th>
              </tbody>
              <tbody>
                <th scope="row">1</th>
                <th> Randy </th>
                <th>7</th>
              </tbody>
            </table>
          </div>					
			</div><!-- /row -->
		</div><!-- /container -->
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="col-lg-7">
            <h1>Take a Break, Join Our Pong Game</h1>
          </div>
          <div class="col-lg-5">
          <br><br><br><br><br>
            <form class="form-inline" role="form">
            <div class="form-group">
              <input type="email" class="form-control" name="in-email" placeholder="Enter email address">
            </div>
            <button type="submit" class="btn btn-warning btn-lg">Invite A Friend!</button>
          </form>
          </div>
        </div>
      </div>
    </div>
	</div><!-- /headerwrap -->
	



	<div class="container">
		<div class="row mt centered">
			<div class="col-lg-6 col-lg-offset-3">
				<h1>Our Awesome Team.<br/>Design Lovers.</h1>
				</div>
		</div><!-- /row -->
		
		<div class="row mt centered">
			<div class="col-lg-4">
				<img class="img-circle" src="assets/img/Tyler.jpg" width="140" alt="">
				<h4>Tyler Davis</h4>
				<p>So, whether you eat or drink, or whatever you do, do all to the glory of God. -- 1 Corinthians 10:31 </p>
				<p><i class="glyphicon glyphicon-send"></i> <i class="glyphicon glyphicon-phone"></i> <i class="glyphicon glyphicon-globe"></i></p>
			</div><!--/col-lg-4 -->

			<div class="col-lg-4">
				<img class="img-circle" src="assets/img/Shawn.jpg" width="140" height="187" alt="">
				<h4>Shawn Yap</h4>
				<p>But I have trusted in thy mercy; my heart shall rejoice in thy salvation. -- Psalms 13:5 </p>
				<p><i class="glyphicon glyphicon-send"></i> <i class="glyphicon glyphicon-phone"></i> <i class="glyphicon glyphicon-globe"></i></p>
			</div><!--/col-lg-4 -->

			<div class="col-lg-4">
				<img class="img-circle" src="assets/img/Randy.jpg" width="140" alt="">
				<h4>Shaocheng Lang</h4>
				<p>But I trust in you, Lord; I say, “You are my God.” -- Psalm 31:14 </p>
				<p><i class="glyphicon glyphicon-send"></i> <i class="glyphicon glyphicon-phone"></i> <i class="glyphicon glyphicon-globe"></i></p>
			</div><!--/col-lg-4 -->
		</div><!-- /row -->
	</div><!-- /container -->
	

	

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
  </body>
</html>


