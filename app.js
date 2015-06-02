var http = require("request");

var fun = function (n) {
	http("https://api.genderize.io/?name=peter", function (error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log(n, body);
			fun(++n);
		}
	});
};

fun(0);
