var Xray = require('x-ray'); // https://github.com/lapwinglabs/x-ray
var x = Xray();

/*
Scrape geojson
*/

function scrape_geojson() {
	x('http://places.geocoders.nl/ibeerepoot/an4cvffw/119', 'html')(function(err, pre) {
	  console.log(pre) // Google
	})
}

/*
Hoeveelheid per soort aanbod
*/

function soort_aanbod_koop(){
	// pak alleen de vier grootste
	x('http://www.funda.nl/koop/heel-nederland/', '.search-sidebar-filter:first-of-type li:nth-child(-n+5)', [{
		soort: '.radio-group-item .radio-group-label',
		aantal: '.count',
	}])
		.write('json/aanbod.json')
}

/*
Vraagprijzen huizen op postcode
*/

function vraagprijzen(soort,limit) {
	x('http://www.funda.nl/koop/heel-nederland/' + soort + '/', '.search-results li', [{
		adres: '.search-result-title',
		postcode: '.search-result-subtitle',
		vraagprijs: '.search-result-price',
	}])
		.paginate('a[title="Volgende pagina"]@href')
		.limit(limit)
		.write('json/vraagprijzen_' + soort + '.json')
}

/*
Vraagprijzen verkochte huizen op postcode
*/

function verkocht(soort,limit) {
	x('http://www.funda.nl/koop/verkocht/heel-nederland/' + soort + '/', '.object-list li', [{
		adres: 'a.object-street',
		vraagprijs: '.price',
		link: 'a.object-street@href',
		details: x('a.object-street@href', '.transaction-data', {
			aangeboden_sinds: '.transaction-date:nth-of-type(1) strong',
			looptijd: '.transaction-date:nth-of-type(2) strong',
			verkoopdatum: '.transaction-date:nth-of-type(3) strong',
		})
	}])
		.paginate('.next@href')	
  		.limit(limit)
		.write('json/verkocht.json')
}

// soort_aanbod_koop();
// vraagprijzen('parkeerplaats',95);
// vraagprijzen('bouwgrond',372);
// vraagprijzen('appartement',3155);
// vraagprijzen('woonhuis',9500);
scrape_geojson();

// verkocht('appartement',);