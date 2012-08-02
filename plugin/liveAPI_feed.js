autowatch = 1;
outlets = 1;

var api = new LiveAPI(test_callback, "live_set");


function bang()
{
	
var all = new Dict();
all.name = "super";	
var groups = api.children;

	for (var i = 0; i < groups.length-1; i++){
		var g = getSetGroup(groups[i]);
		all.set(groups[i],g);
	}
	

}



function getSetGroup(groupPath){
	
	var group = new Dict;
	//group.name = groupPath;
	
	var childrenCount = api.getcount(groupPath);
	
	for (var i = 0; i < childrenCount; i++){
		
		var child = new Dict;
		
		api.goto("live_set "+groupPath+" "+i);
		
		var info = api.info;
		var id = "id"+api.id;
		var props = extractProperties(info);
		
		for (var j = 0; j < props.length; j++){
			var prop = props[j];
			var value = api.get(prop);
			child.set(prop, value);
			
		}
		group.set(id, child);
 	}
	
	api.goto("live_set");
	return group;
		
}

function extractProperties(infoString){
	
	var extracts = [];
	
	extract(infoString);
	
	function extract(string){
		var position = -1;
		position = string.search("property");
		if (position == -1 ){
			return;
		}
		else {
			var newString = string.slice(position+9, string.length);
			var newLine = newString.search("\n");
			var foundProperty = newString.slice(0, newLine);
			var onlyProperty = foundProperty.slice(0, foundProperty.search(" "));
			extracts.push(onlyProperty);		
			extract(newString);
		}	
	}	
	return extracts;	
}

function jsobj_to_dict(o) {
	var d = new Dict;
	for (var key in o)	{
		var value = o[key];

		if (!(typeof value === "string" || typeof value === "number")) {
			value = jsobj_to_dict(value);
		}
		d.set(key, value);
	}
	return d;
}



function test_callback(args){
	
}
	