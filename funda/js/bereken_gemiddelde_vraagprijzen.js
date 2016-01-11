var jsonfile = require('jsonfile');
var util = require('util');

function bereken_gemiddelde() {
	var file = 'json/vraagprijzen_appartement.json';

	jsonfile.readFile(file, function(error, huizen) {
		huizen.forEach(function(huis) {
			console.log(huis.postcode)
		})
	})
}

bereken_gemiddelde();