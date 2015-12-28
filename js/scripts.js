var Xray = require('x-ray');
var x = Xray();

x('https://dribbble.com', 'li.group', [{
  title: '.dribbble-img strong',
  image: '.dribbble-img [data-src]@data-src',
}])
  .paginate('.next_page@href')
  .limit(3)
  .write('results.json')