/*
http://stackoverflow.com/questions/20304862/nodejs-httpget-to-a-url-with-json-response
*/

var request = require('request');
var queue = require("queue-async");
var jsonfile = require('jsonfile');

var q = queue(1);

function scrape_geo(n) {
	request({
		url: 'http://places.geocoders.nl/ibeerepoot/an4cvffw/' + n,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			jsonfile.writeFile('geojson/' + n + '.json', body);
		}
	})
}

// loop through geojson files
for (var i = 950; i < 1000; i++) {
	q = queue(1);
	q.defer(scrape_geo, i);
	q.awaitAll(function(error, results) {
		console.log("Gelukt!");
	})
}
