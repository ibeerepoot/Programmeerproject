// transition van pie naar map: hide pie en show map
function from_pie_to_map(soort) {

	$("#pieChart").hide();

	$(".radio-list").show();

	$("#map").show();

	var meervoud = {woonhuis:"woonhuizen", appartement:"appartementen"};

	// update de text die kopers te zien krijgen
	var soort_bezit = soort.toLowerCase();

	$("#kopers-stap-1").html("Je bent op zoek naar een " + soort_bezit + ".<br>In onderstaande kaart is de gemiddelde vraagprijs van " + meervoud[soort_bezit] + " per 4-cijferige postcode in beeld gebracht.<br>Vink linksonderin de laag met spoorwegen aan om te zien hoe de postcodes zich verhouden tot het openbaar vervoer.<br>");

	createMap(soort_bezit);
}

/*
Pie chart met d3pie library
gebruikt: https://scaleyourcode.com/blog/article/9
*/

d3.json("js/json/aanbod.json", function(error,json) {

	var data = [];
	var colours = ["#006C7D","#009AAE","#86D3E3","#2F4A55"];

	if (error) return console.warn(error);
	json.forEach(function(type, i) {
		// parkeerplaatsen en bouwgrond misschien toch niet zo interessant
		if (i != 2 && i != 3){
			data.push({
				label: type.soort.replace(/\s/g,'').split(/[0-9]/)[0],
				value: parseInt(type.aantal.replace(/\s/g,'')*1000),
				color: colours[i]
			})
		}
	})

	var pie = new d3pie("pieChart", {
		"footer": {
			"text": "Huidige aanbod in Nederland.",
			"color": "#999999",
			"fontSize": 17,
			"font": "Lato",
			"location": "bottom-center"
		},
		"size": {
			"canvasHeight": 650,
			"canvasWidth": 650,
			"pieInnerRadius": "30%",
			"pieOuterRadius": "75%"
		},
		"data": {
			"content": data
		},
		"tooltips": {
			"enabled": true,
			"type": "placeholder",
			"string": "{label}: {value}, {percentage}%",
			"styles": {
				"font": "Lato",
				"fontSize": 14
			}
		},
		"labels": {
			"inner": {
				"format": "value",
				"hideWhenLessThanPercentage": 2
			},
			"mainLabel": {
				"font": "Lato",
				"fontSize": 14
			},
			"percentage": {
				"color": "#e1e1e1",
				"font": "Lato",
				"decimalPlaces": 0
			},
			"value": {
				"color": "#e1e1e1",
				"font": "Lato"
			},
			"lines": {
				"enabled": true,
				"color": "#cccccc"
			},
			"truncation": {
				"enabled": true
			}
		},
		"effects": {
			"pullOutSegmentOnClick": {
				"effect": "linear",
				"speed": 400,
				"size": 8
			}
		},
		"misc": {
			"canvasPadding": {
				"top": 20,
				"left": 20,
				"bottom": 20,
				"left": 20
			}
		},
		"callbacks": {
			onClickSegment: function(a) {
				// pie.destroy();
				from_pie_to_map(a.data.label);
		}
		}
	});
})

function createMap(soort){

	// maak een spinner die laad tot de kaart is gemaakt
	var opts = {
	  lines: 11 // The number of lines to draw
	, length: 0 // The length of each line
	, width: 17 // The line thickness
	, radius: 42 // The radius of the inner circle
	, scale: 1 // Scales overall size of the spinner
	, corners: 1 // Corner roundness (0..1)
	, color: '#000' // #rgb or #rrggbb or array of colors
	, opacity: 0.25 // Opacity of the lines
	, rotate: 0 // The rotation offset
	, direction: 1 // 1: clockwise, -1: counterclockwise
	, speed: 1 // Rounds per second
	, trail: 60 // Afterglow percentage
	, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
	, zIndex: 2e9 // The z-index (defaults to 2000000000)
	, className: 'spinner' // The CSS class to assign to the spinner
	, top: '50%' // Top position relative to parent
	, left: '50%' // Left position relative to parent
	, shadow: false // Whether to render a shadow
	, hwaccel: false // Whether to use hardware acceleration
	, position: 'absolute' // Element positioning
	}
	var target = document.getElementById('map')
	var spinner = new Spinner(opts).spin(target);

	/*
	http://leafletjs.com/examples/choropleth.html
	*/

	var spoorvakkenLayer;
	var overlayMaps;

	// open geojson met spoorvakken
	d3.json('/Programmeerproject/funda/js/geojson/spoorvakken.geojson', function(geojson) {
		spoorvakkenLayer = L.geoJson();

		// loop door de features
		for (var i = 0; i < geojson.features.length; i++) {
			spoorvakkenLayer.addData(geojson.features[i]);
			// als je door alle features heen bent
			if (i == geojson.features.length - 1) {
				// voeg layer toe aan overlaymaps: hier kunnen eventueel nog meer layers worden toegevoegd!
				overlayMaps = {
				    "Spoorwegen": spoorvakkenLayer
				};
				// maak het control vierkantje op: eerste argument is baselayers (kan er maar een van aan staan), 
				// tweede zijn de aanvinkbare layers
				L.control.layers(baseLayer, overlayMaps, {position: 'bottomleft'}).addTo(map);
			}
		}
	})

	// maak de onderste laag met layers van mapbox
	var tiles = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		minZoom: 8,
	    maxZoom: 18,
	    id: 'ibeerepoot.olc86g36',
	    accessToken: 'pk.eyJ1IjoiaWJlZXJlcG9vdCIsImEiOiJjaWo3Y3lqcWkwMDU2dzNtMzV0bnViM2s0In0.egPnUZiAx1Wj9B4pwZlNyQ'
	})

	// initieer de kaart en zorg dat de tiles meteen zichtbaar zijn
	// view op nederland
	var map = L.map('map', {
		layers: tiles
	}).setView([52.3167, 5.55], 8);

	// maak baselayer aan: hier kunnen nog andere layers bij, bijvoorbeeld andere thema's van mapbox
	var baseLayer = {
		"Kaart": tiles
	};

	var gemiddeldes;

	// open het gecleande bestand met postcodes en gemiddelde vraagprijzen
	d3.json('/Programmeerproject/funda/js/json/gemiddeldes_' + soort + '.json', function(error, json) {
		gemiddeldes = json;
		visualiseer_gemiddeldes();
	})

	// functie om te bepalen welke kleur een postcode moet worden
	function getColor(postcode) {
		var gemiddelde_van_postcode = gemiddeldes[postcode];
		return gemiddelde_van_postcode > 2000000 ? '#7f0000' :
			   gemiddelde_van_postcode > 1000000 ? '#990000' :
			   gemiddelde_van_postcode > 700000  ? '#b30000' :
			   gemiddelde_van_postcode > 500000  ? '#c51810' :
			   gemiddelde_van_postcode > 450000  ? '#d7301f' :
			   gemiddelde_van_postcode > 400000  ? '#e34b34' :
			   gemiddelde_van_postcode > 350000  ? '#ef6548' :
			   gemiddelde_van_postcode > 300000	 ? '#f67950' :
			   gemiddelde_van_postcode > 250000  ? '#fc8d59' :
			   gemiddelde_van_postcode > 200000  ? '#fca46e' :
			   gemiddelde_van_postcode > 150000  ? '#fdbb84' :
			   gemiddelde_van_postcode > 100000  ? '#fdc891' :
			   gemiddelde_van_postcode > 50000  ? '#fdd49e' :
			   gemiddelde_van_postcode > 0  ? '#fddeb3' :
			         '#fff' ;
	}

	// functie om te bepalen welke kleur elk element in de legenda moet hebben
	function getSquareColor(niveau) {
	    return niveau > 2000000 ? '#7f0000' :
			   niveau > 1000000 ? '#990000' :
			   niveau > 700000  ? '#b30000' :
			   niveau > 500000  ? '#c51810' :
			   niveau > 450000  ? '#d7301f' :
			   niveau > 400000  ? '#e34b34' :
			   niveau > 350000  ? '#ef6548' :
			   niveau > 300000	? '#f67950' :
			   niveau > 250000  ? '#fc8d59' :
			   niveau > 200000  ? '#fca46e' :
			   niveau > 150000  ? '#fdbb84' :
			   niveau > 100000  ? '#fdc891' :
			   niveau > 50000   ? '#fdd49e' :
			   niveau > 0       ? '#fddeb3' :
			                '#fff' ;
	}

	var geolayer;

	// functie die wordt getriggerd als de gebruiker over een postcode heen gaan
	function highlightFeature(e) {
	    var layer = e.target;

	    layer.setStyle({
	        weight: 5,
	        color: '#666',
	        dashArray: '',
	        fillOpacity: 0.3
	    });

	    if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }
	    info.update(layer.feature.properties);

	}

	// wordt getriggerd als gebruiker niet meer boven de postcode staat
	function resetHighlight(e) {
	    geolayer.resetStyle(e.target);
	    info.update();
	}

	// wordt getriggerd als de gebruiker op een postcode klikt
	function zoomToFeature(e) {
	    map.fitBounds(e.target.getBounds());
	}

	// plaats de tooltip rechtsbovenin
	var info = L.control({position: 'topright'});

	// maak de tooltip div aan
	info.onAdd = function (map) {
	    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	    return this._div;
	};

	// update de tekst die in de tooltip staat als gebruiker over postcodes beweegt
	info.update = function (props) {
		if(props) {
			var gemiddelde_van_postcode = gemiddeldes[props.postcode];
			this._div.innerHTML = '<h4>Vraagprijs per postcode</h4>' +  (gemiddelde_van_postcode != "niet bekend" ?
				        '<b>Postcode: ' + props.postcode + '</b><br />Gemiddelde vraagprijs: ' + gemiddelde_van_postcode 
				        : 'Beweeg over een gekleurde postcode');			
		}
	};

	// voeg info toe aan kaart
	info.addTo(map);

	// geef de postcodes de juiste kleur
	function visualiseer_gemiddeldes() {
		// loop door geojson bestanden
		for (var i = 101; i < 1000; i++) {
			// open bijvoorbeeld 103.json
			d3.json('/Programmeerproject/funda/js/geojson/minified/' + i + '.json', function(geojson) {
				// loop door alle postcodes in dat gebied (max 10)
				for (var i = 0; i < geojson.features.length; i++) {
					// voeg de shape van die postcode toe aan de kaart
					geolayer = L.geoJson(geojson.features[i], {
						// specificeer de stijl die die postcode moet hebben
						style: function(feature) {
							return {
								weight: 1,
								opacity: 1,
								// stuur de postcode mee met de functie
								fillColor: getColor(feature.properties.postcode),
								color: '#ababab',
								dashArray: '1',
								fillOpacity: 0.5
							};
						},
						// functies die elke postcode meekrijgt
						onEachFeature: function (feature, layer) {
					        layer.on({
					        	mouseover: highlightFeature,
					        	mouseout: resetHighlight,
					        	click: zoomToFeature
					        })
					    }
					}).addTo(map);				
				}
			})
			// als alle geojsons zijn geladen, haal dan de spinner weg
			if (i == 999) {
				spinner.stop();
			}
		}
	}
	
	// plaats de legenda rechtsonderin
	var legend = L.control({position: 'bottomright'});

	// maak de legenda
	legend.onAdd = function (map) {

	    var div = L.DomUtil.create('div', 'info legend'),
	    	// geef aan wat de grenzen zijn van de kleuren
	        grades = [0, 50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 700000, 1000000, 2000000],
	        labels = [];

	    // loop through our density intervals and generate a label with a colored square for each interval
	    for (var i = 0; i < grades.length; i++) {
	        div.innerHTML +=
	        	// bepaal de juiste kleur op basis van de grenzen
	            '<i style="background:' + getSquareColor(grades[i] + 1) + '"></i> ' +
	            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	    }
	    return div;
	};

	// voeg de legenda toe aan de kaart
	legend.addTo(map);
}

