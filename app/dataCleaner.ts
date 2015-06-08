/// <reference path="../modules/node.d.ts" />

var http = require("request"),
	fs = require("fs"),
	cheerio = require("cheerio");

/**
 * @csvInPath string that represents the path and name of the source data
 * @csvOutPath string that represents the path and name of the file where the data will be stored after being processed
 * */
var csvInPath:string = "../data/in/nacional.csv",
	csvOutPath:string = "../data/out/step1-ci.csv";


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
var writeAllCIs = (sourcePath:string,
				   targetPath:string,
				   fixerFunctions?:Array<Function>,
				   encode:string = "UTF-8",
				   sourceColumnSeparator:string = ";",
				   sourceRowSeparator:string = "\n",
				   targetColumnSeparator:string = ",",
				   targetRowSeparator:string = "\n") => {
	var currentCi = 0;

	fs.createReadStream(sourcePath)
		.on("data", (personsBatch:string) => {
			var persons:Array<string> = personsBatch.toString().split(sourceRowSeparator);

			var idPersons = persons
				.filter((personString:string) => parseInt(personString.split(sourceColumnSeparator)[1]))
				.map((person) => person.split(sourceColumnSeparator)[1])
				.join(targetRowSeparator);

			currentCi += persons.length;
			fs.appendFileSync(targetPath, idPersons);
			console.log(new Date(), "Citizens written ".concat(currentCi.toString()));
		})
		.on("open", () => {
			console.log("Started on", new Date());
		})
		.on("close", () => {
			console.log("Finished on", new Date());
		})
		.on("error", (msg) => {
			console.log("Error on", new Date(), "Details: " + msg);
		});
};

//step 1 get all the cis.
//writeAllCIs(csvInPath, csvOutPath);

var queryCompleteName = (sourcePath:string,
						 targetPath:string,
						 endpoint:string,
						 fixerFunctions?:Array<Function>,
						 encode:string = "UTF-8",
						 sourceColumnSeparator:string = ",",
						 sourceRowSeparator:string = "\n",
						 targetColumnSeparator:string = ",",
						 targetRowSeparator:string = "\n") => {
	var currentCi = 0;

	fs.createReadStream(sourcePath)
		.on("data", (personsBatch:string) => {
			var ids:Array<string> = personsBatch.toString().split(sourceRowSeparator);

			ids.forEach(ci => {
				http("http://cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=" + ci, (error, response, body) => {
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
		})
		.on("open", () => {
			console.log("Started on", new Date());
		})
		.on("close", () => {
			console.log("Finished on", new Date());
		})
		.on("error", (msg) => {
			console.log("Error on", new Date(), "Details: " + msg);
		});
};