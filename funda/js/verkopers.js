function verkooptabel(soort_verkoop) {
	$("#icoontjes").hide("slow");
	$("#verkopers-stap-1").hide("slow");
	$("#verkoopinfo").show("slow");
	$("#verkopers-stap-2").show("slow");
	$("#zoekPostcode").addClass(soort_verkoop);
}

/*
https://gist.github.com/emeeks/280cb0607c68faf30bb5
*/

function maakTabel(){
	// get de value van het input field dat de gebruiker heeft ingevuld met een postcode
	var zoekPostcode = document.getElementById('zoekPostcode').value;

	// zorg dat de gebruikers wel iets in heeft gevuld
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

	// introductietekstje
	document.getElementById('viz-title').innerHTML = "<br><br><b>Verkochte huizen met deze woonoppervlakte in postcode " + zoekPostcode + ":</b><br>";

	// begin met een schone svg
	d3.select("#viz")
		.select("svg")
		.remove()

	// haal de p weg als die er is
	d3.select("#verkoopinfo")
		.select("p")
		.remove()

	// initieer de timeline
	var timeline = d3.layout.timeline()
  		.size([300,300]);

  	// functie om de kleur van de band te berekenen
  	colorScale = d3.scale.linear()
		  .range(["#cdc3d0", "#002299"]);

	//https://github.com/Caged/d3-tip
	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return d.verkochtAdres + "<br>Vraagprijs: €" + d.verkochtVraagprijs + "</span><br>Tijdsduur: " + d.total;
	  })

  	//d3.json("js/json/verkocht/" + soort_verkoop + "/" + soort_verkoop + woonopp + ".json", function(error,json) {
  	d3.json("js/json/verkocht/" + soort_verkoop + "/" + soort_verkoop + woonopp + "_herschreven.json", function(error,json) {
  		if(error) return console.warn(error);

  		var data = [];
  		var nummerinloop = 0;

  		var minDatum;
  		var maxDatum;

  		json.forEach(function(verkochtHuis){
  			// push alleen de data van de postcode waar de gebruiker naar zoekt
  			if (zoekPostcode == verkochtHuis.verkochtPostcode){
  				// als de verkoopdetails ontbreken, voeg het huis dan niet toe
  				if (verkochtHuis.start != "niet gevonden"){
  					data.push(verkochtHuis);
  				}	
  			}
  			nummerinloop += 1;
  			// als we door alle data heen zijn, doe dan wat met data
  			if (nummerinloop == json.length){
  				// als er geen info beschikbaar is
  				if (data.length == 0) {
  					d3.select("#verkoopinfo").append("p").text("Geen informatie gevonden over huizen in deze postcode met deze woonoppervlakte. Probeer te zoeken op een andere postcode of woonoppervlakte.");
  				}
  				else {
  					// transformeer de data naar data geschikt voor de timeline
	  				timelineBands = timeline(data);

	  				// set het domein van de colorscale met de minimale en maximal vraagprijs
	  				var minVraagprijs = d3.min(data, function(d) { return d.verkochtVraagprijs; })
	  				var maxVraagprijs = d3.max(data, function(d) { return d.verkochtVraagprijs; })
	  				colorScale.domain([minVraagprijs,maxVraagprijs]);

	  				// bereken de eerste en laatste datum van de data om te gebruiken voor de x-as
	  				minDatum = d3.min(timelineBands, function(d) { return d.originalStart; })
	  				maxDatum = d3.max(timelineBands, function(d) { return d.originalEnd; })

	  				d3.select("#viz")
						.append("svg")
						// maak de hoogte dynamisch: aantal bands x hoogte van de bands plus wat extra voor het mooie
						.attr("height", timelineBands.length*18+100);

	  				/* Invoke the tip in the context of your visualization */
					d3.select("#viz svg").call(tip)

			  		d3.select("#viz svg").selectAll("rect")
			  			.data(timelineBands)
			  			.enter()
			  			.append('rect')
			  			// bepaal waar de band moet beginnen
			  			.attr("x", function (d) {
			  				// als de data mist/niet een nummer is
			  				if (isNaN(d.start) == true){
			  					return 0
			  				}
			  				// maak hem 2x zo breed als standaard
			  				else {
			  					return d.start*2
			  				}
			  			})
			  			// bereken de hoogte van de band inclusief padding
			  			.attr("y", function (d) {
			  				return d.id * 18;
			  			})
			 			// set de hoogte op 15
			  			.attr("height", 15)
			  			.attr("width", function (d) {
			  				// als data mist/geen nummer is
			  				if (isNaN(d.start) == true){
			  					return 0
			  				}
			  				// maak 2x zo breed als standaard
			  				else {
			  					return d.end*2 - d.start*2
			  				}
			  			})
			  			// kleur de bands aan de hand van de vraagprijs
			  			.style("fill", function (d) {
			  				return colorScale(d.verkochtVraagprijs)
			  			})
			  			.style("stroke", "black")
			  			.style("stroke-width", 0.5)
			  			// regel de tooltip
			  			.on('mouseover', tip.show)
	      				.on('mouseout', tip.hide)
	  				}
  				}
  		})

		// set het domein en range voor de x-as
		var x = d3.time.scale()
			.domain([minDatum,maxDatum])
			.range([0,600])

		// bereken de langste looptijd
		var verschilminmax = (maxDatum - minDatum) / 1000000000;

		// ticks per maand
		var xAxis_kort = d3.svg.axis()
		    .scale(x)
		    .ticks(d3.time.month,1)
		    	.tickFormat(d3.time.format("%b'%y"))
		    .orient("top");

		// ticks per 3 maanden
		var xAxis_middel = d3.svg.axis()
		    .scale(x)
		    .ticks(d3.time.month,3)
		    	.tickFormat(d3.time.format("%b'%y"))
		    .orient("top");

		// ticks per 6 maanden
		var xAxis_lang = d3.svg.axis()
		    .scale(x)
		    .ticks(d3.time.month,6)
		    	.tickFormat(d3.time.format("%b'%y"))
		    .orient("top");

		// als er korte looptijden tussen zitten, doe dan ticks per maand
		if (verschilminmax < 20){
			// voeg de x-as toe
			d3.select("#viz svg").append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0,0)")
		      .call(xAxis_kort);
		}
		// als er langere looptijden tussen zitten, doe dan ticks per 3 maanden
		else if ((20 <= verschilminmax) && (verschilminmax <= 50)) {
			// voeg de x-as toe
			d3.select("#viz svg").append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0,0)")
		      .call(xAxis_middel);
		}
		// als er hele lange looptijden tussen zitten, doe dan ticks per 6 maanden
		else {
			// voeg de x-as toe
			d3.select("#viz svg").append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0,0)")
		      .call(xAxis_lang);
		}		
  	})

}