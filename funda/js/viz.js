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
			value: parseInt(type.aantal.replace(/\s/g,'').replace('/\./g','')),
			color: colours[i]
		})
		console.log(i);
	})

	var pie = new d3pie("pieChart", {
		"footer": {
			"text": "Aanbod in Nederland. Aantallen x1000.",
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
		"callbacks": {}
	});
})



