/// <reference path="../modules/node.d.ts" />
var http = require("request"), fs = require("fs"), cheerio = require("cheerio");
/**
 * @csvInPath string that represents the path and name of the source data
 * @csvOutPath string that represents the path and name of the file where the data will be stored after being processed
 * */
var csvInPath = "../data/in/nacional.csv", csvOutPath = "../data/out/step1-ci.csv";
/**
 *
 * @sourcePath string that shows the location of the .csv to analyze.
 * @targetPath string that shows the location where you want to write the resulting .csv to analyze.
 * @fixerFunctions array with all the functions that will be executed to tidy up the data set, functions must return the dataSet.
 * @encode optional string parameter that allows to change the encoded type default is UTF-8.
 * @columnSeparator optional character that is used as the splitter between columns.
 * @rowSeparator optional character that is used as the splitter between the rows.
 * Note: async method to read big files.
 * */
var writeAllCIs = function (sourcePath, targetPath, fixerFunctions, encode, sourceColumnSeparator, sourceRowSeparator, targetColumnSeparator, targetRowSeparator) {
    if (encode === void 0) { encode = "UTF-8"; }
    if (sourceColumnSeparator === void 0) { sourceColumnSeparator = ";"; }
    if (sourceRowSeparator === void 0) { sourceRowSeparator = "\n"; }
    if (targetColumnSeparator === void 0) { targetColumnSeparator = ","; }
    if (targetRowSeparator === void 0) { targetRowSeparator = "\n"; }
    var currentCi = 0;
    fs.createReadStream(sourcePath).on("data", function (personsBatch) {
        var persons = personsBatch.toString().split(sourceRowSeparator);
        var idPersons = persons.filter(function (personString) { return parseInt(personString.split(sourceColumnSeparator)[1]); }).map(function (person) { return person.split(sourceColumnSeparator)[1]; }).join(targetRowSeparator);
        currentCi += persons.length;
        fs.appendFileSync(targetPath, idPersons);
        console.log(new Date(), "Citizens written ".concat(currentCi.toString()));
    }).on("open", function () {
        console.log("Started on", new Date());
    }).on("close", function () {
        console.log("Finished on", new Date());
    }).on("error", function (msg) {
        console.log("Error on", new Date(), "Details: " + msg);
    });
};
//step 1 get all the cis.
//writeAllCIs(csvInPath, csvOutPath);
var queryCompleteName = function (sourcePath, targetPath, endpoint, fixerFunctions, encode, sourceColumnSeparator, sourceRowSeparator, targetColumnSeparator, targetRowSeparator) {
    if (encode === void 0) { encode = "UTF-8"; }
    if (sourceColumnSeparator === void 0) { sourceColumnSeparator = ","; }
    if (sourceRowSeparator === void 0) { sourceRowSeparator = "\n"; }
    if (targetColumnSeparator === void 0) { targetColumnSeparator = ","; }
    if (targetRowSeparator === void 0) { targetRowSeparator = "\n"; }
    var currentCi = 0;
    fs.createReadStream(sourcePath).on("data", function (personsBatch) {
        var ids = personsBatch.toString().split(sourceRowSeparator);
        ids.forEach(function (ci) {
            http("http://cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=" + ci, function (error, response, body) {
                if (body && !error) {
                    var $ = cheerio.load(body);
                    if ($("tr b").length > 3) {
                        var line = citizen[0] + "," + $("tr b")[3].children[0].data + "\n";
                        fs.appendFileSync(targetPath, line);
                    }
                }
            });
        });
        currentCi += ids.length;
        fs.appendFileSync(targetPath, idPersons);
        console.log(new Date(), "Citizens written ".concat(currentCi.toString()));
    }).on("open", function () {
        console.log("Started on", new Date());
    }).on("close", function () {
        console.log("Finished on", new Date());
    }).on("error", function (msg) {
        console.log("Error on", new Date(), "Details: " + msg);
    });
};
//# sourceMappingURL=dataCleaner.js.map