function verkooptabel(soort_verkoop) {
	$("#icoontjes").hide("slow");
	$("#verkopers-stap-1").hide("slow");
	$("#verkoopinfo").show("slow");
	$("#verkopers-stap-2").show("slow");
	$("#zoekPostcode").addClass(soort_verkoop);
}

function maakTabel(){
	// get de value van het input field dat de gebruiker heeft ingevuld met een postcode
	var zoekPostcode = document.getElementById('zoekPostcode').value;

	if (zoekPostcode == null || zoekPostcode == ""){
		alert("Er moet een postcode worden ingevuld");
	}

	// get het soort dat de gebruiker wil verkopen, en maak de tabel op basis daarvan
	var soort_verkoop = document.getElementById('zoekPostcode').className.split(" ")[1];

	var radios = document.getElementsByName('optradio');

	var woonopp = "";

	// laat de gebruiker bij appartementen en woonhuizen de woonoppervlakte kiezen
	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
			// set radio value als woonoppervlak
	        woonopp = radios[i].value;
	        break;
	    }
	}

	document.getElementById('results').innerHTML += "<br><br><b>Huizen met woonoppervlakte " + woonopp + " in postcode " + zoekPostcode + ":</b><br>";

	d3.json("js/json/verkocht/" + soort_verkoop + "/" + soort_verkoop + woonopp + ".json", function(error,json) {
		if (error) return console.warn(error);
		var counter = 0;
		json.forEach(function(verkochtHuis){
			var postcodeVanHuis = verkochtHuis.verkochtPostcode;
			if (postcodeVanHuis == zoekPostcode) {
				document.getElementById('results').innerHTML += '<br>' + verkochtHuis.verkochtAdres + ', €' + verkochtHuis.verkochtVraagprijs + ', ' + verkochtHuis.details.total + ', van: ' + verkochtHuis.details.start + ', tot: ' + verkochtHuis.details.end;
				counter++;
			}
		})
		if (counter == 0){
			document.getElementById('results').innerHTML += '<br>Sorry, op deze postcode hebben geen huizen te koop gestaan met de gekozen woonoppervlakte. Het lijkt erop dat je de eerste bent die dit type huis hier probeert te verkopen!'
		}
	})

	var timeline = d3.layout.timeline()
  		.size([300,300]);

  	//d3.json("js/json/verkocht/" + soort_verkoop + "/" + soort_verkoop + woonopp + ".json", function(error,json) {
  	d3.json("js/json/verkocht/woonhuis/woonhuis050.json", function(error,json) {
  		if(error) return console.warn(error);

  		var data = [];

  		json.forEach(function(verkochtHuis){
  			if (zoekPostcode == verkochtHuis.verkochtPostcode){
  				data.push(verkochtHuis.details);
  			}
  		})
  		console.log(data);

  		timelineBands = timeline(data);

  		d3.select("#viz svg").selectAll("rect")
  			.data(timelineBands)
  			.enter()
  			.attr("x", function (d) {
  				return d.start
  			})
  			.attr("y", function (d) {
  				return d.y
  			})
  			.attr("height", 15)
  			.attr("width", function (d) {
  				return d.details.end - d.details.start
  			})
  			.style("fill", "#0099ae")
  			.style("stroke", "black")
  			.style("stroke-width", 1)
  	})
}