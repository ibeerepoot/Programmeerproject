var d3 = require("d3");

d3.json("http://places.geocoders.nl/ibeerepoot/an4cvffw/119", function(error,geo) {
	console.log(geo);
})