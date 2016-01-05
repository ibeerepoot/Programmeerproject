var jsonfile = require('jsonfile');


function remove_whitespace() {
	var bestand = 'json/aanbod.json';
	jsonfile.readFile(bestand, function(error, data) {
		var minified_data = {};
		data.forEach(function(datum) {
			if (datum.hasOwnProperty("soort")) {
				console.log(datum);
			}
			//console.log("Datum: ", datum);
			var minified_datum = JSON.stringify(datum);
		})
		
		// jsonfile.writeFile('json/aanbod_minified.json', data);
	});
}

remove_whitespace();