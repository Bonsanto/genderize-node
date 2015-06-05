/// <reference path="../modules/node.d.ts" />
var http = require("request"), fs = require("fs"), cheerio = require("cheerio");
//todo: try to find a way to get all names from genderize.io but the limit is 1k per day, so sad.
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
var csvInPath = "../data/data.csv", csvOutPath = "../data/" + (new Date()).toDateString() + "out.csv";
/**
 * @sourcePath string that shows the location of the .csv to analyze.
 * @fixerFunctions array with all the functions that will be executed to tidy up the data set, functions must return the dataSet.
 * @encode optional string parameter that allows to change the encoded type default is UTF-8.
 * @columnSeparator optional character that is used as the splitter between columns.
 * @rowSeparator optional character that is used as the splitter between the rows.
 * */
var readCSVFile = function (sourcePath, targetPath, fixerFunctions, encode, columnSeparator, rowSeparator) {
    if (encode === void 0) { encode = "UTF-8"; }
    if (columnSeparator === void 0) { columnSeparator = ","; }
    if (rowSeparator === void 0) { rowSeparator = "\n"; }
    fs.readFile(sourcePath, encode, function (err, data) {
        var dataSet = data.split(rowSeparator).map(function (row) { return row.split(columnSeparator); }).filter(function (row) { return row.length > 1; }), tempDataSet = dataSet;
        fixerFunctions.forEach(function (fun) {
            tempDataSet = fun(tempDataSet, csvOutPath);
        });
        console.log(dataSet.length);
        console.log(tempDataSet.length);
    });
};
var findSpacedNames = function (dataSet) {
    return dataSet.filter(function (row) { return row.length > 2 && row[1].indexOf(" ") > -1; });
};
var writeCSV = function (dataSet, path, columnSeparator, rowSeparator) {
    if (columnSeparator === void 0) { columnSeparator = ","; }
    if (rowSeparator === void 0) { rowSeparator = "\n"; }
    fs.writeFile(path, dataSet.map(function (row) { return row.join(columnSeparator); }).join(rowSeparator), function (error) {
        if (error)
            throw error;
        console.log("File saved");
    });
    return dataSet;
};
//
//var fixNames:Function = (dataSet:Array<Array<string>>) => {
//	var cheerio = require
//	var tempData = dataSet;
//
//	return tempData;
//};
readCSVFile(csvInPath, csvOutPath, [findSpacedNames, writeCSV]);
//
//var favio = function () {
//	ugly.forEach(function (nombre) {
//		//fun(nombre.split(",")[0]);
//		console.log(nombre);
//	});
//	console.log(ugly.length);
//	fun(ugly[0]);
//};
//
//var fun = function (ci) {
//	http("http://cne.gob.ve/web/registro_electoral/ce_psuv2015.php?nacionalidad=V&cedula=" + ci, function (error, response, body) {
//		if (!error && response.statusCode === 200) {
//			console.log(body);
//		}
//	});
//}; 
//# sourceMappingURL=app.js.map