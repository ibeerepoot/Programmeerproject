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

function vraagprijzen(soort,vanPagina,totPagina) {
	x('http://www.funda.nl/koop/heel-nederland/' + soort + '/p' + vanPagina , '.search-results li', [{
		adres: '.search-result-title',
		postcode: '.search-result-subtitle',
		vraagprijs: '.search-result-price',
	}])
		.paginate('a[title="Volgende pagina"]@href')
		.limit(totPagina)
		.write('json/vraagprijzen_' + soort + '.json')
}

/*
Vraagprijzen verkochte huizen op postcode
*/

function verkocht(soort,vanm2,totm2) {
	x('http://www.funda.nl/koop/verkocht/heel-nederland/' + vanm2 + '-' + totm2 + '-woonopp/' + soort + '/', '.object-list li', [{
		adres: 'a.object-street',
		postcode: '.properties-list:nth-of-type(1)',
		vraagprijs: '.price',
		link: 'a.object-street@href',
		details: x('a.object-street@href', '.transaction-data'),
	}])
		.paginate('.next@href')	
  		//.limit(limit)
		.write('json/verkocht_' + soort + vanm2 + totm2 + '.json')
}

// soort_aanbod_koop();
//vraagprijzen('parkeergelegenheid',93);
//vraagprijzen('bouwgrond',371);
//vraagprijzen('appartement',1,500);
//vraagprijzen('woonhuis',9433);

//verkocht('appartement',0,50);
//verkocht('appartement',50,80);
//verkocht('appartement',80,90);
//verkocht('appartement',90,100);
//verkocht('woonhuis',0,50);
//verkocht('woonhuis',50,80);
//verkocht('woonhuis',80,90);
//verkocht('woonhuis',90,100);
verkocht('woonhuis',100,110);
//verkocht('bouwgrond',0,100000);