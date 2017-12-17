function login() {

	console.log('login');
	var formEmail = document.getElementById("form-email-login").value;
	var formPassword = document.getElementById("form-password-login").value;
	console.log(formEmail);
	console.log(formPassword);

	var headers = {
		'Content-Type': 'application/json',
	};

	var dataString = `{ "email": "` + formEmail + `", "password": "` + formPassword + `" }`;
	console.log(dataString);

	var url = 'https://opyo6yseaa.execute-api.us-east-1.amazonaws.com/chan1/user'
	$.ajax({
		url: url,
		type: 'GET',
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Content-Type', 'application/json');
		},
		headers: headers,
		contentType: 'application/json',
		data: { getDataString: dataString },
		success: function (response) {
			console.log(response);
			var phoneResponse = response["Item"]["phone"]["S"]
			console.log(phoneResponse)
			window.location = '/?phone=' + phoneResponse;
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function signup() {

	console.log('signup');
	var formEmail = document.getElementById("form-email-signup").value;
	var formPassword = document.getElementById("form-password-signup").value;
	var formPhone = document.getElementById("form-phone").value;
	console.log(formEmail);
	console.log(formPassword);
	console.log(formPhone);

	var dataString = `{ "email": "` + formEmail + `", "password": "` + formPassword + `", "phone": "` + formPhone + `" }`;
	console.log(dataString);

	var headers = {
		'Content-Type': 'application/json',
	};
	
	var url = 'https://opyo6yseaa.execute-api.us-east-1.amazonaws.com/chan1/user'
	$.ajax({
		url: url,
		type: 'POST',
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Content-Type', 'application/json');
		},
		headers: headers,
		contentType: 'application/json',
		data: dataString,
		success: function (response) {
			console.log(response);
			var phoneResponse = response["Item"]["phone"]["S"]
			console.log(phoneResponse)
			window.location = '/?phone=' + phoneResponse;
		},
		error: function (response) {
			console.log(response);
		},
	});

}