/// <reference path="../modules/node.d.ts" />
var http = require("request"), fs = require("fs"), cheerio = require("cheerio");
/**
 * @csvInPath string that represents the path and name of the source data
 * @csvOutPath string that represents the path and name of the file where the data will be stored after being processed
 * */
var csvInPath = "../data/out/step1-ci.csv", csvOutPath = "../data/out/step1-ci1.csv", removedPath = "../data/out/removed.csv", errorPath = "../data/out/notResponded.csv";
/**
 *
 * @sourcePath string that shows the location of the .csv to analyze.
 * @targetPath string that shows the location where you want to write the resulting .csv to analyze.
 * @fixerFunctions array with all the functions that will be executed to tidy up the data set, functions must return the dataSet.
 * @encode optional string parameter that allows to change the encoded type default is utf-8
 * @columnSeparator optional character that is used as the splitter between columns.
 * @rowSeparator optional character that is used as the splitter between the rows.
 * Note: async method to read big files.
 * */
var writeAllCIs = function (sourcePath, targetPath, fixerFunctions, encode, sourceColumnSeparator, sourceRowSeparator, targetColumnSeparator, targetRowSeparator) {
    if (encode === void 0) { encode = "utf-8"; }
    if (sourceColumnSeparator === void 0) { sourceColumnSeparator = ";"; }
    if (sourceRowSeparator === void 0) { sourceRowSeparator = "\n"; }
    if (targetColumnSeparator === void 0) { targetColumnSeparator = ","; }
    if (targetRowSeparator === void 0) { targetRowSeparator = "\n"; }
    var leftOvers = "";
    fs.createReadStream(sourcePath).on("data", function (personsBatch) {
        leftOvers = leftOvers.concat(personsBatch.toString().replace(/[^0-9|\n]/g, ""));
    }).on("open", function () {
        console.log("Started on", new Date());
    }).on("close", function () {
        fs.appendFileSync(targetPath, leftOvers.slice(1, leftOvers.length), {
            "encode": "utf-8"
        });
        console.log("Registers: ", leftOvers.split(targetRowSeparator).length);
        console.log("Finished on", new Date());
    }).on("error", function (msg) {
        console.log("Error on", new Date(), "Details: " + msg);
    });
};
var queryCompleteName = function (sourcePath, targetPath, errorPath, removedPath, endpoint, fixerFunctions, encode, sourceColumnSeparator, sourceRowSeparator, targetColumnSeparator, targetRowSeparator) {
    if (encode === void 0) { encode = "utf-8"; }
    if (sourceColumnSeparator === void 0) { sourceColumnSeparator = ","; }
    if (sourceRowSeparator === void 0) { sourceRowSeparator = "\n"; }
    if (targetColumnSeparator === void 0) { targetColumnSeparator = ","; }
    if (targetRowSeparator === void 0) { targetRowSeparator = "\n"; }
    var leftOvers = "";
    fs.createReadStream(sourcePath).on("data", function (personCi) {
        leftOvers = leftOvers.concat(personCi.toString());
    }).on("open", function () {
        console.log("Started on", new Date());
    }).on("close", function () {
        console.log("Finished on", new Date());
        var cis = leftOvers.split(/\n/g);
        cis.shift();
        console.log(cis[0]);
        //todo: read the files and findout which lines msut be deleted.
        var execute = function (data) {
            var oldData = data;
            var ci = data.pop();
            var newData = data;
            http(endpoint.concat(ci), function (error, response, body) {
                if (body && !error) {
                    var $ = cheerio.load(body);
                    if ($("tr b").length > 3) {
                        var completeName = $("tr b")[3].children[0].data.replace(/\s+/g, " ");
                        var line = ci + targetColumnSeparator + completeName + targetRowSeparator;
                        //If the returned data is consistent
                        if (completeName.split(" ") > 1) {
                            console.log(line);
                            fs.appendFileSync(targetPath, line, {
                                "encode": "utf-8"
                            });
                        }
                        else {
                            execute(oldData);
                        }
                    }
                    else {
                        fs.appendFileSync(removedPath, ci + targetRowSeparator, {
                            "encode": "utf-8"
                        });
                    }
                    execute(newData);
                }
                else if (error) {
                    console.log(error, ci);
                    fs.appendFileSync(errorPath, ci + targetRowSeparator, {
                        "encode": "utf-8"
                    });
                    execute(oldData);
                }
            });
        };
        console.log("Total is", cis.length);
        execute(cis);
    }).on("error", function (msg) {
        console.log("Error on", new Date(), "Details: " + msg);
    });
};
//step 1 get all the cis.
//writeAllCIs(csvInPath, csvOutPath);
//step 2 get all the names from the API.
csvInPath = "../data/out/step1-ci1.csv";
csvOutPath = "../data/out/step2-ci-completeName.csv";
queryCompleteName(csvInPath, csvOutPath, errorPath, removedPath, "http://cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=");
//# sourceMappingURL=dataCleaner.js.map