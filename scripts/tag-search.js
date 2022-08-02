#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

const readFile = function (path, encoding) {
	!encoding && (encoding = $.NSUTF8StringEncoding);
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
};
function alfredMatcher (str) {
	return str.replace (/\/|-|_/g, " ") + " " + str;
}

const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const tagsJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/tags.json";
const mergeNestedTags = $.getenv("merge_nested_tags") === "true" || false;
const jsonArray = [];

// Supercharged Icons File
let superchargedIconFileExists = false;
const superchargedIconFile = $.getenv("supercharged_icon_file").replace(/^~/, app.pathTo("home folder"));
if (superchargedIconFile) superchargedIconFileExists = Application("Finder").exists(Path(superchargedIconFile));
let superchargedIconList;
if (superchargedIconFileExists) {
	superchargedIconList = readFile(superchargedIconFile)
		.split("\n")
		.filter(l => l.length !== 0);
}

// eslint-disable-next-line no-var, vars-on-top
var tagsArray = JSON.parse (readFile(tagsJSON))
	.map (function(t) {
		t.merged = false;
		return t;
	});

if (mergeNestedTags) {

	// reduce tag-key to the parent-tag.
	tagsArray = tagsArray.map (function (t) {
		t.tag = t.tag.split("/")[0];
		return t;
	});

	// merge tag-object based on same tag-key https://stackoverflow.com/a/33850667
	const mergedTags = [];
	tagsArray.forEach (item => {
		const existing = mergedTags.filter(j => j.tag === item.tag);
		if (existing.length) {
			const mergeIndex = mergedTags.indexOf(existing[0]);
			mergedTags[mergeIndex].tagCount += item.tagCount;
			mergedTags[mergeIndex].merged = true;
		} else
			mergedTags.push(item);

	});
	tagsArray = mergedTags;
}

tagsArray.forEach(tagData => {
	const tagName = tagData.tag;
	const tagQuery =
		"obsidian://search?vault=" + $.getenv("vault_name_ENC") +
		"&query=" + encodeURIComponent("tag:#" + tagName);

	let mergeInfo = "";
	let extraMatcher = "";
	if (tagData.merged) {
		mergeInfo = "  [merged]";
		extraMatcher += " merged parent";
	}
	if (tagName.includes ("/")) extraMatcher += " nested child";

	let superchargedIcon = "";
	let superchargedIcon2 = "";
	if (superchargedIconFileExists) {
		superchargedIconList.forEach(pair => {
			const tag = pair.split(",")[0].toLowerCase().replaceAll("#", "");
			const icon = pair.split(",")[1];
			const icon2 = pair.split(",")[2];
			if (tagName === tag && icon) superchargedIcon = icon + " ";
			else if (tagName === tag && icon2) superchargedIcon2 = " " + icon2;
		});
	}

	jsonArray.push({
		"title": superchargedIcon + "#" + tagName + superchargedIcon2,
		"subtitle": tagData.tagCount + "x" + mergeInfo,
		"match": alfredMatcher (tagName) + " #" + alfredMatcher (tagName) + extraMatcher,
		"uid": tagName,
		"arg": tagName,
		"mods": { "cmd": { "arg": tagQuery } },
	});
});

JSON.stringify({ items: jsonArray });
