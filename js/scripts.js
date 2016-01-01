/*
werkt niet
hoe access je een naamloze json array?
*/

function remove_whitespace(){
	var json = JSON.parse(aanbod);
	for (var i = 0; i < json.length; i++){
		for (var key in i) {
			trim(json[i][i]);
		}
	}
}

var Xray = require('x-ray');
var x = Xray();

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
		vraagprijs: '.price',
	}])
		.paginate('.next@href')	
  		.limit(10)
		.write('verkocht.json')
}

soort_aanbod();
// remove_whitespace();
vraagprijzen(1055,'amsterdam','appartement');
verkocht(1624,'hoorn-nh','appartement');