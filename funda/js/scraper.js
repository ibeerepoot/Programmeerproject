var Xray = require('x-ray'); // https://github.com/lapwinglabs/x-ray
var x = Xray();

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

function vraagprijzen(postcode,stad,soort) {
	x('http://www.funda.nl/koop/' + stad + '/' + postcode + '/' + soort + '/', '.search-results li', [{
		adres: '.search-result-title',
		vraagprijs: '.search-result-price',
	}])
		.paginate('a[title="Volgende pagina"]@href')	
  		.limit(10)
		.write('json/vraagprijzen.json')
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
		.write('json/verkocht.json')
}

soort_aanbod_koop();
soort_aanbod_verkocht();
vraagprijzen(1055,'amsterdam','appartement');
verkocht(1624,'hoorn-nh','appartement');