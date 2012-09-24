autowatch = 1;
outlets = 1;

var api = new LiveAPI(test_callback, "live_set");
var all = new Dict();
all.name = "super";

function map(path)
{

	var pathFormat = path.replace(" ", "::");
	post(pathFormat);
	var level = all.get(pathFormat);
	post(level.get("loop"));
		var m = mapLevel(path);
		all.set(path,m);

}

function mapLevel(startPath){
	
		api.goto(startPath);

		var info = api.info;

		//post(info+"\n");

		if (info != "No object") 
		{

			var me = new Dict;

			var propNames = extractInfo(info, "property");
			var childrenNames = api.children;

			//post(childrenNames+"\n");

			if (propNames.length != 0){
				for (var j = 0; j < propNames.length; j++){
					var prop = propNames[j];
					var value = api.get(prop);
					me.set(prop, value);	
				}	
			}

			if (childrenNames.length != 0){
				for (var j = 0; j < childrenNames.length; j++){
					var child = childrenNames[j];
					var emptyCont = new Dict;
					me.set(child, emptyCont);	
				}	
			}
					
			return me;
		}
	//}
}

function getChildren(){

	var childrenNames = api.children;

			if(childrenNames[0] != 0 && childrenNames.length > 1) {

				if(typeof(childrenNames[0]) == "number"){
					for (var i = 0; i < childrenNames[0]; i++){
							var newPath = startPath+" "+i;
							api.goto(newPath);
							if (api.info != "No object")
								var child = traverse(newPath);
									if(child)
										me.set(i.toString(), child);							
					}
				}
				else {
					for (var n = 0; n < childrenNames.length; n++){
						if (childrenNames[n] != "canonical_parent"){
							var newPath = startPath+" "+childrenNames[n];
							api.goto(newPath);
							if (api.info != "No object")
								var child = traverse(newPath);	
									if(child)
										me.set(childrenNames[n], child);				
						}	
					}
				}
			}
}

function extractInfo(infoString, what){
	
	var extracts = [];
	
	extract(infoString);

	//post(what.length+"\n");
	
	function extract(string){
		var position = -1;
		position = string.search(what);
		if (position == -1 ){
			return;
		}
		else {
			var newString = string.slice(position+what.length+1, string.length);
			var newLine = newString.search("\n");
			var foundProperty = newString.slice(0, newLine);
			var onlyProperty = foundProperty.slice(0, foundProperty.search(" "));
			extracts.push(onlyProperty);		
			extract(newString);
		}	
	}	
	return extracts;	
}

function extractChildren(infoString){
	
	var extracts = [];
	
	extract(infoString);
	
	function extract(string){
		var position = -1;
		position = string.search("children");
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
	