var request = require('request');
var jsonfile = require('jsonfile');
var util = require('util');
var needle = require('needle');

function steden() {
	// open het bestand
	var file = 'postcodes.json'
	jsonfile.readFile(file, function(error, postcodes) {
		var steden = {};
		var timeout = 0;
		// loop door alle postcodes in het bestand
		postcodes.forEach(function(postcode) {
			var bijbehorende_stad = "Amsterdam";
			var form = {
				'filter_location' : postcode.PC4,
				'autocomplete-identifier' : '0',
				'filter_location_-previous' : '',
				'filter_Afstand' : '0',
				'filter_FundaKoopPrijsVan' : '0',
				'filter_FundaKoopPrijsTot' : 'ignore_filter'
			};
			// delay de request, anders wordt funda boos
			setTimeout(function(){
				needle.post('http://www.funda.nl/objectresultlist/index/', form, function(err, resp, body) {
					if(!err){
						bijbehorende_stad = resp.headers.location;
						steden[postcode.PC4] = bijbehorende_stad;
						jsonfile.writeFile('postcodes_met_steden.json', steden);
					}
					else {
						console.log(err);
					}
				});
			}, timeout);

			timeout += 1000;

		});
		// jsonfile.writeFile('postcodes_met_steden.json', steden);
	})
}

steden();