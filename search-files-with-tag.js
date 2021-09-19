#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;

const taggedNotes = JSON.parse($.getenv("taggedNotes"));
const tagToSearch = $.getenv("tagToSearch");
const vault_path = $.getenv("vault_path");

var jsonArray = [];
taggedNotes.forEach(relativePath => {
	let absolutePath = vault_path + "/" + relativePath;
	let filename = relativePath.split("/").pop().slice(0, -3);
	let relativeLocation = relativePath.slice(0, (filename.length+3)*-1);
	let alfredMatcher = filename.replaceAll("-"," ") + " " + filename;

	jsonArray.push({
		'title': filename,
		'subtitle': "▸ " + relativeLocation,
		'match': alfredMatcher,
		'arg': absolutePath,
	});
});

JSON.stringify({ items: jsonArray });
