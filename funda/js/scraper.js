var Xray = require('x-ray'); // https://github.com/lapwinglabs/x-ray
var x = Xray();
var jsonfile = require('jsonfile');

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
		.paginate('a[title="Volgende pagina"]@href')
		.write('json/tekoop/' + soort + '.json')
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
		}])
			.paginate('.next@href')	
		(function(err, obj){
			if (err) {
				reject(err);
			}
			else {
				// clean de objecten en push ze naar de verkoopinfo array
				obj.forEach(function(result) {
					if(result.vraagprijs) {
						var verkochtAdres = result.adres.replace(/\n/g,'');
						var verkochtPostcode = result.postcode.replace(/\s/g,'').substring(0,4);
						var verkochtVraagprijs = result.vraagprijs.replace(/€\s/g,'').replace(/\sk.k./g,'').replace(/\./g,'').replace(/\svon/g,'');
						var verkochtLink = result.link;
						var verkochtObject = {verkochtAdres,verkochtPostcode,verkochtVraagprijs,verkochtLink};
						//console.log(verkochtObject);
						verkoopinfo.push(verkochtObject);						
					}
				})	
				resolve(verkoopinfo);
			}
		})
	})
}

function getDetails(linkje, nummer, cb) {
	// scrape de individuele pagina's
	x(linkje, '.transaction-data', {
		start: '.transaction-date:nth-of-type(1) strong',
		total: '.transaction-date:nth-of-type(3) strong',
		end: '.transaction-date:nth-of-type(5) strong',
	})(function(err, obj){
		// format de datums
		var startArray = obj.start.split('-');
		obj.start = startArray[1] + '/' + startArray[0] + '/' + startArray[2];
		var endArray = obj.end.split('-');
		obj.end = endArray[1] + '/' + endArray[0] + '/' + endArray[2];
		cb(obj);
	})
}	

function scrapeVerkocht(soort,vanm2,totm2){
	verkocht(soort,vanm2,totm2).then(function(objecteninlijst){
		var written = 0;
		objecteninlijst.forEach(function(objectinlijst, i) {
			getDetails(objectinlijst.verkochtLink, i, function(data) {
				objectinlijst.details = data;
				written += 1;
				if(written == objecteninlijst.length) {
					jsonfile.writeFileSync('json/verkocht/' + soort + '/' + soort + vanm2 + totm2 + '.json', objecteninlijst)
				}
			});
		})
	}, function(err) {
		console.error(err);
	})
}

// soort_aanbod_koop();

//scrapeVerkocht('appartement',0,50);
//scrapeVerkocht('appartement',50,80);
//scrapeVerkocht('appartement',80,90);
//scrapeVerkocht('appartement',90,100);
//scrapeVerkocht('appartement',100,110);
//scrapeVerkocht('appartement',110,120);
//scrapeVerkocht('appartement',120,130);
//scrapeVerkocht('appartement',130,140);
//scrapeVerkocht('appartement',140,160);
scrapeVerkocht('appartement',160,5000);
//scrapeVerkocht('woonhuis',0,50);
//scrapeVerkocht('woonhuis',50,80);
//scrapeVerkocht('woonhuis',80,90);
//scrapeVerkocht('woonhuis',90,100);
//scrapeVerkocht('woonhuis',100,110);
//scrapeVerkocht('woonhuis',110,120);
//scrapeVerkocht('woonhuis',120,130);
//scrapeVerkocht('woonhuis',130,140);
//scrapeVerkocht('woonhuis',140,160);
//scrapeVerkocht('woonhuis',160,5000);