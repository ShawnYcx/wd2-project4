
<!DOCTYPE html>
<html lang="en">
  <head>

    <title>Registration</title>

  </head>

  <body>

    <div class="container">

      <div >
          <div >
              <div >
                  <div>
                      <h3><strong>Create An Account</strong></h3>
                  </div>
                  <div>
                      <form role="form" name="registerForm" method="POST" action="register_data.php">
                          <fieldset>
                            <div>
                                  <input id="name" placeholder="Name" name="nameActual" type="text" autofocus required>
                              </div>
                              <div>
                                  <input id="e1" placeholder="E-mail" name="email" type="email" required>
                              </div>
                              <div >
                                  <input  id="e2" placeholder="Confirm E-mail" name="email2" type="email" onkeyup="checkEmail()" required>
                                  
                              </div>
                              <div>
                                  <input id="pass1" placeholder="Password" name="password" type="password" required>
                              </div>
                              <div >
                                  <input  id="pass2" placeholder="Confirm Password" name="password2" type="password" onkeyup="checkPass(); return false" required>
                                  
                                  <hr>
                              </div>
                              <!-- Change this to a button or input when using this as a form -->
                              <input type="hidden" name="action" value="add_user" />
                              <button class="btn btn-lg btn-success btn-block">Sign Up</button>
                          </fieldset>
                      </form>
                      <center><a href="."><b>Already have an account?</b></a></center>
                  </div>
              </div>
          </div>
      </div>
    </div>

  </body>
</html>
