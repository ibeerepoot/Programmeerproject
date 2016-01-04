var Xray = require('x-ray'); // https://github.com/lapwinglabs/x-ray
var x = Xray();

var request = require('request');
var jsonfile = require('jsonfile');
var util = require('util');
var needle = require('needle');

/*
Hoeveelheid per soort aanbod
*/

function soort_aanbod(){
	x('http://www.funda.nl/koop/heel-nederland/', '.search-sidebar-filter:first-of-type li', [{
		soort: '.radio-group-item .radio-group-label',
		aantal: '.count',
	}])
		.write('aanbod.json')
}

/*
Vraagprijzen huizen op postcode
*/

function vraagprijzen(postcode,stad,soort) {
	x('http://www.funda.nl/koop/' + stad + '/' + postcode + '/' + soort + '/', '.search-results li', [{
		adres: '.search-result-title',
		vraagprijs: '.search-result-price',
	}])
		.paginate('a[title="Volgende pagina"]@href')	
  		.limit(10)
		.write('vraagprijzen.json')
}

/*
Vraagprijzen verkochte huizen op postcode
*/

function verkocht(postcode,stad,soort) {
	x('http://www.funda.nl/koop/verkocht/' + stad + '/' + postcode + '/' + soort + '/', '.object-list li', [{
		adres: 'a.object-street',
		vraagprijs: '.price',
		link: 'a.object-street@href',
		details: x('a.object-street@href', '.transaction-data', [{
			aangeboden_sinds: '.transaction-date::nth-of-type(1) strong',
			looptijd: '.transaction-date::nth-of-type(2) strong',
			verkoopdatum: '.transaction-date::nth-of-type(3) strong',
		}])
	}])
		.paginate('.next@href')	
  		.limit(10)
		.write('verkocht.json')
}

function steden() {
	// open het bestand
	var file = 'postcodes.json'
	jsonfile.readFile(file, function(error, postcodes) {
		var steden = {};
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
			needle.post('http://www.funda.nl/objectresultlist/index/', form, function(err, resp, body) {
				if(!err){
					console.log(resp.headers.location);
				}
				else {
					console.log(err);
				}
			});
			steden[postcode.PC4] = bijbehorende_stad; 

		});
		jsonfile.writeFile('postcodes_met_steden.json', steden);
	})
}
//soort_aanbod();
//vraagprijzen(1055,'amsterdam','appartement');
//verkocht(1624,'hoorn-nh','appartement');
steden();