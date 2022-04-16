#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function alfredMatcher (str) {
	return str.replace (/[-()_.]/g, " ") + " " + str;
}
function parentFolder (filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1)
		.join("/");
}

const homepath = app.pathTo("home folder");
const vaultPath = $.getenv("vaultPath").replace(/^~/, homepath);
const jsonArray = [];

let folderArray =
	app.doShellScript('find "' + vaultPath + '" -type d -not -path "*/\\.*"')
		.split("\r");
if (!folderArray) folderArray = [];

folderArray.forEach(absolutePath => {
	const name = absolutePath.split("/").pop();
	const relativePath = absolutePath.slice(vaultPath.length + 1);

	jsonArray.push({
		"title": name,
		"match": alfredMatcher(name),
		"subtitle": "▸ " + parentFolder(relativePath),
		"arg": absolutePath,
		"uid": absolutePath,
	});
});

JSON.stringify({ items: jsonArray });
