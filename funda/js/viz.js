function visualizeit(){
	// http://bl.ocks.org/dbuezas/9306799

	var width = 300;
	var height = 150;

	var color = d3.scale.category20b();

	// create the svg and center it
	var svg = d3.select(".clients")
		.append("svg")
		.append("g")
		.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

	var radius = Math.min(width, height) / 2;

	var arc = d3.svg.arc()
	  .outerRadius(radius);

	var pie = d3.layout.pie()
	  .value(function(d) { return d.aantal; })
	  .sort(null);

	var path = svg.selectAll('path')
	  .data(pie(dataset))
	  .enter()
	  .append('path')
	  .attr('d', arc)
	  .attr('fill', function(d, i) { 
	  	console.log(d);
	    return color(d.data.aantal);
	  });

	path.append("text")
		/*
		.attr("transform", function(d) {
			return "translate(" + arc.centroid(d) + ")";
		})
*/
		.attr("text-anchor", "middle")
		.text(function(d) {
			return d.data.soort;
		})
}

d3.json("js/json/aanbod.json", function(error,json) {
	if (error) return console.warn(error);
	dataset = json;
	visualizeit();
})

