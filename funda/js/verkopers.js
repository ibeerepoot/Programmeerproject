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

	document.getElementById('viz-title').innerHTML = "<br><br><b>Huizen met deze woonoppervlakte in postcode " + zoekPostcode + ":</b><br>";

	d3.select("#viz")
		.select("svg")
		.remove()

	var timeline = d3.layout.timeline()
  		.size([300,300]);

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

  		json.forEach(function(verkochtHuis){
  			// push alleen de data van de postcode waar de gebruiker naar zoekt
  			if (zoekPostcode == verkochtHuis.verkochtPostcode){
  				data.push(verkochtHuis);
  			}
  			nummerinloop += 1;
  			// als we door alle data heen zijn, doe dan wat met data
  			if (nummerinloop == json.length){

  				timelineBands = timeline(data);

  				// set het domein van de colorscale met de minimale en maximal vraagprijs
  				var minVraagprijs = d3.min(data, function(d) { return d.verkochtVraagprijs; })
  				var maxVraagprijs = d3.max(data, function(d) { return d.verkochtVraagprijs; })
  				colorScale.domain([minVraagprijs,maxVraagprijs]);

  				d3.select("#viz")
					.append("svg")

  				/* Invoke the tip in the context of your visualization */
				d3.select("#viz svg").call(tip)

				/*d3.select("#viz svg").selectAll("text")
					.data(timelineBands)
		  			.enter()
		  			.append('text')
		  			.text(function(d){
		  				return d.verkochtAdres
		  			})
		  			.attr("x", 0)
		  			.attr("y", function (d) {
		  				return d.id * 18;
		  			})
		  			.attr("height", 15)*/

		  		d3.select("#viz svg").selectAll("rect")
		  			.data(timelineBands)
		  			.enter()
		  			.append('rect')
		  			.attr("x", function (d) {
		  				// if data is missing
		  				if (isNaN(d.start) == true){
		  					return 0
		  				}
		  				else {
		  					return d.start*2
		  				}
		  			})
		  			.attr("y", function (d) {
		  				return d.id * 18;
		  			})
		  			.attr("height", 15)
		  			.attr("width", function (d) {
		  				// if data is missing
		  				if (isNaN(d.start) == true){
		  					return 0
		  				}
		  				else {
		  					return d.end*2 - d.start*2
		  				}
		  			})
		  			.style("fill", function (d) {
		  				return colorScale(d.verkochtVraagprijs)
		  			})
		  			.style("stroke", "black")
		  			.style("stroke-width", 0.5)
		  			.on('mouseover', tip.show)
      				.on('mouseout', tip.hide)
  			}
  		})
  	})
}