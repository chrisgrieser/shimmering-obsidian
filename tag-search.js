#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const tagsJSON = vault_path + "/.obsidian/plugins/launcher-bridge/tags.json";

var tags_array = app.doShellScript(
   'cat "' + tagsJSON + '" | grep ' + "'" + '"' + 'tag' + '"' + "'"
   + "| cut -d '" + '"' + "' -f 4"
).split("\r");


let jsonArray = [];
tags_array.forEach(tagName => {

	jsonArray.push({
		'title': "#" + tagName,
		'match': tagName,
		'arg': tagName,
	});
});

JSON.stringify({ items: jsonArray });
