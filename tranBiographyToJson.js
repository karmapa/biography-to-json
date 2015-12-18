var category = "Lijiang";
var divisionTag = "division"; //<division> or <division1>, there's a Sanskrit name in <division1> tag; 
var sutraProps = ["vol", "page", "tname", "aname", "sname", "cname", "homage", "subject", "yana", "chakra", "location", "audience", "aurthor", "requester", "dharma", "purpose", "collect", "bampo", "relation", "debate", "translator", "reviser"]; //set props in sutra obj;

var fs = require("fs");
var xmlContent = fs.readFileSync("./biography.xml","utf8");

var splitContent = function(content) { 
	var divisions = content.replace(/<division>/g,"~~~<division>").split("~~~");
    for (var i = 1; i < divisions.length; i++) {
    	divisions[i] = divisions[i].replace(/<sutra>/g,"###<sutra>").split("###");
    };
    return divisions;
}

var createSutraObject = function(str) {
	var sutra = {};
	sutra["sutraid"] = str.match(/<sutraid n="(.+?)"\/>/)[1];
	for (var i = 0; i < sutraProps.length; i++) {
		var tagName = sutraProps[i];
		var regex = new RegExp("<" + tagName + ">(.+)</" + tagName + ">"); 
		var regex2 = new RegExp("<" + tagName + "></" + tagName + ">");
		if (str.match(regex)) {
			sutra[tagName] = str.match(regex)[1];
		} else if (str.match(regex2)) {
			sutra[tagName] = "";
		} else {
			console.log("error", tagName, sutra.sutraid);
		}
	}
	return sutra;
}

var createSutraArr = function(arr) {
	var sutras = [];
	for (var i = 1; i < arr.length; i++) {
		sutras.push(createSutraObject(arr[i]));
	}
	return sutras;	
}

var createFinalObj = function(arr) {
	var finalobj = {};
	finalobj["categoryName"] = category;
    var divisions = [];
	for (var i = 1; i < arr.length; i++) {
		var division = {};
		var regex = new RegExp("<" + divisionTag + ">(.+)</" + divisionTag + ">");
		division["divisionName"] = arr[i][0].match(regex)[1];
		division["sutras"] = createSutraArr(arr[i]);
		divisions.push(division);
	}
	finalobj["divisions"] = divisions;
	return finalobj;
}

var divisionArr = splitContent(xmlContent);
var finalObj = createFinalObj(divisionArr);

fs.writeFileSync("./biography.json", JSON.stringify(finalObj, "", " "), "utf8");