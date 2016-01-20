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

var koopinfo = [];

function vraagprijzen(soort,page) {
	x('http://www.funda.nl/koop/heel-nederland/' + soort + '/p' + page, '.search-results li', [{
		adres: '.search-result-title',
		postcode: '.search-result-subtitle',
		vraagprijs: '.search-result-price',
	}])(function(err, obj){
		obj.forEach(function(result) {
			//console.log(result);
			koopinfo.push(result);
		})
	})
		//.paginate('a[title="Volgende pagina"]@href')
		//.write('json/tekoop/' + soort + '.json')
}

//vraagprijzen('woonhuis',2);
//console.log(koopinfo);

/*
Vraagprijzen verkochte huizen op postcode
*/

/*function verkocht(soort,vanm2,totm2) {
	x('http://www.funda.nl/koop/verkocht/heel-nederland/' + vanm2 + '-' + totm2 + '-woonopp/' + soort + '/', '.object-list li', [{
		adres: 'a.object-street',
		postcode: '.properties-list:nth-of-type(1)',
		vraagprijs: '.price',
		link: 'a.object-street@href',
		start: x('a.object-street@href', '.transaction-date:nth-of-type(1) strong'),
		total: x('a.object-street@href', '.transaction-date:nth-of-type(3) strong'),
		end: x('a.object-street@href', '.transaction-date:nth-of-type(5) strong'),
	}])
		.paginate('.next@href')	
  		//.limit(limit)
		.write('json/verkocht/' + soort + '/' + soort + vanm2 + totm2 + '.json')
}*/

var verkoopinfo = [];

function verkocht(soort,vanm2,totm2) {
	return new Promise(function(resolve,reject) {
		x('http://www.funda.nl/koop/verkocht/heel-nederland/' + vanm2 + '-' + totm2 + '-woonopp/' + soort + '/', '.object-list li', [{
			adres: 'a.object-street',
			postcode: '.properties-list:nth-of-type(1)',
			vraagprijs: '.price',
			link: 'a.object-street@href',
		}])(function(err, obj){
			if (err) {
				reject(err);
			}
			else {
				obj.forEach(function(result) {
					verkoopinfo.push(result);
				})	
				resolve(verkoopinfo);
			}
		})
	})
}

function getDetails(linkje) {
	x(linkje, '.transaction-data', {
		start: '.transaction-date:nth-of-type(1) strong',
		total: '.transaction-date:nth-of-type(3) strong',
		end: '.transaction-date:nth-of-type(5) strong',
	})(function(err, obj){
		console.log(obj);
	})
}	

verkocht('woonhuis',0,50).then(function(objecteninlijst){
	objecteninlijst.forEach(function(objectinlijst) {
		console.log("objectinlijst: ", objecteninlijst);
	})
}, function(err) {
	console.error(err);
})

// soort_aanbod_koop();

//verkocht('appartement',0,50);
//verkocht('appartement',50,80);
//verkocht('appartement',80,90);
//verkocht('appartement',90,100);
//verkocht('appartement',100,110);
//verkocht('appartement',110,120);
//verkocht('appartement',120,130);
//verkocht('appartement',130,140);
//verkocht('appartement',140,160);
//verkocht('appartement',160,5000);
//verkocht('woonhuis',0,50);
//verkocht('woonhuis',50,80);
//verkocht('woonhuis',80,90);
//verkocht('woonhuis',90,100);
//verkocht('woonhuis',100,110);
//verkocht('woonhuis',110,120);
//verkocht('woonhuis',120,130);
//verkocht('woonhuis',130,140);
//verkocht('woonhuis',140,160);
//verkocht('woonhuis',160,5000);