var Xray = require('x-ray');
var x = Xray();

x('https://dribbble.com', 'li.group', [{
  title: '.dribbble-img strong',
  image: '.dribbble-img [data-src]@data-src',
}])
  .paginate('.next_page@href')
  .limit(3)
  .write('results.json')


// ga naar http://www.funda.nl/koop/heel-nederland/
// pak de 1e .search-sidebar-filter
// loop door alle .radio-group-item s
// pak de content in .count

x('http://www.funda.nl/koop/heel-nederland/', '.search-sidebar-filter:first-of-type li', [{
	soort: '.radio-group-item .radio-group-label',
	aantal: '.count',
}])
	.write('aanbod.json')