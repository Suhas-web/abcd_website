function validateEmail(email) {
	var re =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function validateIndianPhoneNumber(phoneNumber) {
	var re = /^[6-9]\d{9}$/;
	return re.test(phoneNumber);
}

function validatePassword(password) {
	return password && password.length > 6 && password.length < 15;
}

export { validateEmail, validateIndianPhoneNumber, validatePassword };
