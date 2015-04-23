function invitation(){
	var name = document.getElementById("name").value;
	var emailto = document.getElementById("emailto").value;
	var emailfrom = document.getElementById("emailfrom").value;

	
	if (emailto == ''){
		alert("Please Enter Email Field");
	}
	else{
		$.ajax({
			type: "POST",
			url: "invitation.php",
			data: {'name':name, 'emailto':emailto,'emailfrom':email}
			cache: false,
			success: function() {
				alert("invitation has been sent");
				}
		});
	}
	return false;
}