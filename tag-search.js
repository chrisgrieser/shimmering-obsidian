#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const tagsJSON = vault_path + "/.obsidian/plugins/metadata-extractor/tags.json";

var tags_array = app.doShellScript(
   'cat "' + tagsJSON + '" | grep -A1 ' + "'" + '"tag"' + "'"
    + ' | cut -d: -f2'
).split("--\r");


let jsonArray = [];
tags_array.forEach(tagData => {
	tagName = tagData.split("\r")[0].split('"')[1];
	tagCount = tagData.split("\r")[1].slice(1,-1);

	jsonArray.push({
		'title': "#" + tagName,
		'subtitle': tagCount,
		'match': tagName,
		'arg': tagName,
	});
});

JSON.stringify({ items: jsonArray });
