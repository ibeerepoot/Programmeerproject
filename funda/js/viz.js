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
	// var colours = ["#2F4A55","#006C7D","#009AAE","86D3E3"];
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



