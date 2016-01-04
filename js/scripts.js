/*
werkt niet
hoe access je een naamloze json array?
*/

function remove_whitespace(){
	var json = JSON.parse(aanbod);
	for (var i = 0; i < json.length; i++){
		for (var key in i) {
			trim(json[i][key]);
		}
	}
}

// remove_whitespace();

d3.json('aanbod.json', function(error, json){
	if (error) return console.warn(error);
	var data = JSON.stringify(JSON.parse(json));
	console.log(data);
})