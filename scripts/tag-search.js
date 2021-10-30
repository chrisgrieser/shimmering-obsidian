#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import('Foundation');
app = Application.currentApplication();
app.includeStandardAdditions = true;

const readFile = function (path, encoding) {
    !encoding && (encoding = $.NSUTF8StringEncoding);
    const fm = $.NSFileManager.defaultManager;
    const data = fm.contentsAtPath(path);
    const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
    return ObjC.unwrap(str);
};
function alfredMatcher (str){
	return str.replace (/\/|-|_/g," ") + " " + str;
}

const homepath = app.pathTo("home folder");
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const vault_name = vault_path.split("/").pop();
const tagsJSON = vault_path + "/.obsidian/plugins/metadata-extractor/tags.json";
const merge_nested_tags = $.getenv("merge_nested_tags") == "true" || false;
let jsonArray = [];

var tags_array = JSON.parse (readFile(tagsJSON))
	.map (function(t){
		t.merged = false;
		return t;
	});
if (merge_nested_tags) {

	//reduce tag-key to the parent-tag.
	tags_array = tags_array.map (function (t){
		t.tag = t.tag.split("/")[0];
		return t;
	});

	// merge tag-object based on same tag-key https://stackoverflow.com/a/33850667
	var merged_tags = [];
	tags_array.forEach (item => {
		let existing = merged_tags.filter(j => j.tag == item.tag);
		if (existing.length) {
			let mergeIndex = merged_tags.indexOf(existing[0]);
    		merged_tags[mergeIndex].tagCount += item.tagCount;
    		merged_tags[mergeIndex].merged = true;
		} else {
			merged_tags.push(item);
		}
  	});
  	tags_array = merged_tags;
}

tags_array.forEach(tagData => {
	let tagName = tagData.tag;
	let taggedNotes = tagData.relativePaths;
	let tagCount = tagData.tagCount;
	let tagQuery =
		"obsidian://search?vault=" + encodeURIComponent(vault_name) +
		"&query=" + encodeURIComponent("tag:#" + tagName);

	let merge_info = "";
	let extraMatcher = "";
	if (tagData.merged) {
		merge_info = "  [merged]";
		extraMatcher += " merged parent";
	}
	if (tagName.includes ("/")) extraMatcher += " nested child";

	jsonArray.push({
		'title': "#" + tagName,
		'subtitle': tagData.tagCount + "x" + merge_info,
		'match': alfredMatcher (tagName) + " #" + alfredMatcher (tagName) + extraMatcher,
		'uid': tagName,
		'arg': tagName,
		'mods':{
			'cmd':{'arg': tagQuery },
		},
	});
});

JSON.stringify({ items: jsonArray });
