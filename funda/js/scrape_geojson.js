/*
http://stackoverflow.com/questions/20304862/nodejs-httpget-to-a-url-with-json-response
*/

var request = require('request');
var queue = require("queue-async");
var jsonfile = require('jsonfile');

// doe maar een taak tegelijk
var q = queue(1);

// scrape de geojson data van de gegeven url
function scrape_geo(n) {
	request({
		url: 'http://places.geocoders.nl/ibeerepoot/an4cvffw/' + n,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			// schrijf naar bestand
			jsonfile.writeFile('geojson/' + n + '.json', body);
		}
	})
}

// loop door geojson bestanden
for (var i = 950; i < 1000; i++) {
	// zet queue weer op 1
	q = queue(1);
	// wacht met scrapen
	q.defer(scrape_geo, i);
	// als alles af is
	q.awaitAll(function(error, results) {
		console.log("Gelukt!");
	})
}
