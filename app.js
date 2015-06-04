var http = require("request"),
	fs = require("fs");

//var fun = function (n) {
//	http("https://api.genderize.io/?name=peter", function (error, response, body) {
//		if (!error && response.statusCode === 200) {
//			console.log(n, body);
//			fun(++n);
//		}
//	});
//};
//
//fun(0);
var arr = [];
var pepe;
var sep = "\n";
var ugly = [];
var realNames = [];

fs.readFile("data/nombres_sin_genero.csv", "utf-8", function (err, data) {
	pepe = data.split(sep);
	pepe.forEach(function (e) {
		var word = e.split(",");
		if (word.length > 1 && word[1].indexOf(" ") > -1)
			ugly.push(e);
	});
	console.log(pepe.length);
	favio();
});

var favio = function () {
	ugly.forEach(function (nombre) {
		//fun(nombre.split(",")[0]);
		console.log(nombre);
	});
	console.log(ugly.length);
	fun(ugly[0]);
};

var fun = function (ci) {
	http("http://cne.gob.ve/web/registro_electoral/ce_psuv2015.php?nacionalidad=V&cedula=" + ci, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log(body);
		}
	});
};