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
	// get het soort dat de gebruiker wil verkopen, en maak de tabel op basis daarvan
	var soort_verkoop = document.getElementById('zoekPostcode').className.split(" ")[1];

	var radios = document.getElementsByName('optradio');

	var woonopp = "";

	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
			// set radio value als woonopp
	        woonopp = radios[i].value;
	        break;
	    }
	}

	document.getElementById('results').innerHTML += "<br><br><b>Huizen met woonoppervlakte " + woonopp + " in postcode " + zoekPostcode + ":</b><br>";

	d3.json("js/json/verkocht/" + soort_verkoop + "/verkocht_" + soort_verkoop + woonopp + ".json", function(error,json) {
		if (error) return console.warn(error);
		json.forEach(function(verkochtHuis){
			//console.log(verkochtHuis);
			var postcodeVanHuis = verkochtHuis.postcode.replace(/\s/g,'').substring(0,4);
			if (postcodeVanHuis == zoekPostcode) {
				document.getElementById('results').innerHTML += '<br>' + verkochtHuis.adres + ', ' + verkochtHuis.vraagprijs + ', ' + verkochtHuis.link;
			}
		})
	})
}