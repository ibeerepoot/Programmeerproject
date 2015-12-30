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
Vraagprijzen woonhuizen op postcode
*/

function vraagprijzen(postcode,soort) {
	x('http://www.funda.nl/koop/amsterdam/' + postcode + '/' + soort + '/', '.search-results li', [{
		vraagprijs: '.search-result-price',
	}])
		// blijft op eerste pagina
		.paginate('.previous-next-page:nth-of-type(2) a@href')	
  		.limit(10)
		.write('vraagprijzen.json')
}

soort_aanbod();
// remove_whitespace();
vraagprijzen(1055,'appartement');