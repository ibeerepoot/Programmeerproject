function from_pie_to_map(soort) {
	console.log("From pie to map: ", soort);

	$("#pieChart").hide("slow");

	$("#choro").show("slow");

	var meervoud = {Woonhuis:"woonhuizen", Appartement:"appartementen", Parkeerplaats:"parkeerplaatsen", Bouwgrond:"bouwgrond"};

	// update de text die kopers te zien krijgen
	var soort_bezit = soort.toLowerCase();

	console.log(soort);
	$("#kopers-stap-1").html("Je bent op zoek naar een " + soort_bezit + ".<br>In onderstaande kaart is de gemiddelde vraagprijs van " + meervoud[soort] + " per 4-cijferige postcode in beeld gebracht.");

}

/*
Pie chart met d3pie library
gebruikt: https://scaleyourcode.com/blog/article/9
*/

d3.json("js/json/aanbod.json", function(error,json) {

	var data = [];
	var colours = ["#2F4A55","#006C7D","#009AAE","#86D3E3"];

	if (error) return console.warn(error);
	json.forEach(function(type, i) {
			data.push({
			label: type.soort.replace(/\s/g,'').split(/[0-9]/)[0],
			value: parseInt(type.aantal.replace(/\s/g,'')*1000),
			color: colours[i]
		})
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

/*
http://leafletjs.com/examples/choropleth.html
*/

var map = L.map('map').setView([52.3167, 5.55], 7);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	minZoom: 7,
    maxZoom: 18,
    id: 'ibeerepoot.olc86g36',
    accessToken: 'pk.eyJ1IjoiaWJlZXJlcG9vdCIsImEiOiJjaWo3Y3lqcWkwMDU2dzNtMzV0bnViM2s0In0.egPnUZiAx1Wj9B4pwZlNyQ'
}).addTo(map);

function getColor(postcode) {
	// open het gecleande bestand met postcodes en gemiddelde vraagprijzen
	d3.json('/Programmeerproject/funda/js/json/gemiddeldes.json', function(error, json) {
		if (error) return console.warn(error);
		else {
			// loop door alle objecten in het json bestand (4053 lang)
			for (var key in json){
				// zoek het object dat bij de huidige postcode hoort
				if (json[key].postcode == postcode){
					// sla de bijbehorende vraagprijs op
					var gemiddelde_van_postcode = json[key].gemiddelde_vraagprijs;
					/*
					// console.log(gemiddelde_van_postcode);
					return gemiddelde_van_postcode > 350000  ? '#800026' :
				           gemiddelde_van_postcode > 300000  ? '#BD0026' :
				           gemiddelde_van_postcode > 250000  ? '#E31A1C' :
				           gemiddelde_van_postcode > 200000  ? '#FC4E2A' :
				           gemiddelde_van_postcode > 150000  ? '#FD8D3C' :
				           gemiddelde_van_postcode > 100000  ? '#FEB24C' :
				           gemiddelde_van_postcode > 50000   ? '#FED976' :
				                         '#808080' ;
				    */
				}
			}
		}
	})
	
	return postcode > 6000  ? '#800026' :
           postcode > 5000  ? '#BD0026' :
           postcode > 4000  ? '#E31A1C' :
           postcode > 3000  ? '#FC4E2A' :
           postcode > 2000  ? '#FD8D3C' :
           postcode > 1000  ? '#FEB24C' :
           postcode > 0   ? '#FED976' :
                         '#808080' ;
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
}

function resetHighlight(e) {
    geolayer.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

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
							color: 'white',
							dashArray: '1',
							fillOpacity: 0.3
						};
					},
					onEachFeature: function (feature, layer) {
				        layer.bindPopup(feature.properties.postcode);
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

visualiseer_gemiddeldes();

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 50000, 100000, 150000, 200000, 250000, 300000, 350000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);