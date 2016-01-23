function from_pie_to_map(soort) {

	$("#pieChart").hide();

	$(".radio-list").show();

	$("#map").show();

	var meervoud = {woonhuis:"woonhuizen", appartement:"appartementen"};

	// update de text die kopers te zien krijgen
	var soort_bezit = soort.toLowerCase();

	$("#kopers-stap-1").html("Je bent op zoek naar een " + soort_bezit + ".<br>In onderstaande kaart is de gemiddelde vraagprijs van " + meervoud[soort_bezit] + " per 4-cijferige postcode in beeld gebracht.<br>");

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
				"right": 20,
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
	/*
	http://leafletjs.com/examples/choropleth.html
	*/

	var map = L.map('map').setView([52.3167, 5.55], 8);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		minZoom: 7,
	    maxZoom: 18,
	    id: 'ibeerepoot.olc86g36',
	    accessToken: 'pk.eyJ1IjoiaWJlZXJlcG9vdCIsImEiOiJjaWo3Y3lqcWkwMDU2dzNtMzV0bnViM2s0In0.egPnUZiAx1Wj9B4pwZlNyQ'
	}).addTo(map);

	var gemiddeldes;

	// open het gecleande bestand met postcodes en gemiddelde vraagprijzen
	d3.json('/Programmeerproject/funda/js/json/gemiddeldes_' + soort + '.json', function(error, json) {
		gemiddeldes = json;
		visualiseer_gemiddeldes();
	})

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

	function resetHighlight(e) {
	    geolayer.resetStyle(e.target);
	    info.update();
	}

	function zoomToFeature(e) {
	    map.fitBounds(e.target.getBounds());
	}

	var info = L.control();

	info.onAdd = function (map) {
	    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	    return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info.update = function (props) {
		if(props) {
			var gemiddelde_van_postcode = gemiddeldes[props.postcode];
			this._div.innerHTML = '<h4>Vraagprijs per postcode</h4>' +  (gemiddelde_van_postcode != "niet bekend" ?
				        '<b>Postcode: ' + props.postcode + '</b><br />Gemiddelde vraagprijs: ' + gemiddelde_van_postcode 
				        : 'Beweeg over een gekleurde postcode');			
		}
	};

	info.addTo(map);

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
		}
	}

	

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

	    var div = L.DomUtil.create('div', 'info legend'),
	        grades = [0, 50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 700000, 1000000, 2000000],
	        labels = [];

	    // loop through our density intervals and generate a label with a colored square for each interval
	    for (var i = 0; i < grades.length; i++) {
	        div.innerHTML +=
	            '<i style="background:' + getSquareColor(grades[i] + 1) + '"></i> ' +
	            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	    }
	    return div;
	};

	legend.addTo(map);
}

