#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const tagsJSON = vault_path + "/.obsidian/plugins/metadata-extractor/tags.json";

// JXA file reader
function readFile(file) {
    var fileString = file.toString();
    return app.read(Path(fileString));
}

var tags_array = JSON.parse (readFile(tagsJSON));

let jsonArray = [];
tags_array.forEach(tagData => {
	tagName = tagData.tag;
	tagCount = tagData.tagCount;

	jsonArray.push({
		'title': "#" + tagName,
		'subtitle': tagCount,
		'match': tagName,
		'arg': tagName,
	});
});

JSON.stringify({ items: jsonArray });
