#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import('Foundation');
app = Application.currentApplication();
app.includeStandardAdditions = true;

function alfredMatcher (str){
	return str.replace (/[-\(\)_\.]/g," ") + " " + str;
}
function parentFolder (filePath){
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0,-1).join("/");
}

const homepath = app.pathTo("home folder");
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
let jsonArray = [];

var folder_array =
	app.doShellScript('find "' + vault_path + '" -type d -not -path "*/\.*"')
	.split("\r");
if (folder_array == "") folder_array = [];

folder_array.forEach(absolutePath => {
	let name = absolutePath.split("/").pop();
	let relativePath = absolutePath.slice(vault_path.length + 1);

	jsonArray.push({
		'title': name,
		'match': alfredMatcher(name),
		'subtitle': "▸ " + parentFolder(relativePath),
		'arg': absolutePath,
		'uid': absolutePath,
	});
});

JSON.stringify({ items: jsonArray });
