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
const alfredMatcher = str => str.replace(/[-()_.]/g, " ") + " " + str;
const fileExists = filePath => Application("Finder").exists(Path(filePath));

//──────────────────────────────────────────────────────────────────────────────

function getVaultPath() {
	const _app = Application.currentApplication();
	_app.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
}
const vaultPath = getVaultPath();
const tagsJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/tags.json";
const mergeNestedTags = $.getenv("merge_nested_tags") === "1";
const superIconFile = $.getenv("supercharged_icon_file").replace(/^~/, app.pathTo("home folder"));
const jsonArray = [];

let superIconList = [];
if (superIconFile && fileExists(superIconFile)) {
	superIconList = readFile(superIconFile)
		.split("\n")
		.filter(l => l.length !== 0);
}
console.log("superIconList length: " + superIconList.length);

function getVaultNameEncoded() {
	const _app = Application.currentApplication();
	_app.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const _vaultPath = ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
	return encodeURIComponent(_vaultPath.replace(/.*\//, ""));
}
const vaultNameEnc = getVaultNameEncoded();

//──────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line no-var, vars-on-top
let tagsArray = JSON.parse(readFile(tagsJSON)).map(function (t) {
	t.merged = false;
	return t;
});

//──────────────────────────────────────────────────────────────────────────────

if (mergeNestedTags) {
	// reduce tag-key to the parent-tag.
	tagsArray = tagsArray.map(function (t) {
		t.tag = t.tag.split("/")[0];
		return t;
	});

	// merge tag-object based on same tag-key https://stackoverflow.com/a/33850667
	const mergedTags = [];
	tagsArray.forEach(item => {
		const existing = mergedTags.filter(j => j.tag === item.tag);
		if (existing.length) {
			const mergeIndex = mergedTags.indexOf(existing[0]);
			mergedTags[mergeIndex].tagCount += item.tagCount;
			mergedTags[mergeIndex].merged = true;
		} else mergedTags.push(item);
	});
	tagsArray = mergedTags;
}

tagsArray.forEach(tagData => {
	const tagName = tagData.tag;
	const tagQuery = "obsidian://search?vault=" + vaultNameEnc + "&query=" + encodeURIComponent("tag:#" + tagName);

	let mergeInfo = "";
	let extraMatcher = "";
	if (tagData.merged) {
		mergeInfo = "  [merged]";
		extraMatcher += " merged parent";
	}
	if (tagName.includes("/")) extraMatcher += " nested child";

	let superchargedIcon = "";
	let superchargedIcon2 = "";
	if (superIconList) {
		superIconList.forEach(pair => {
			const tag = pair.split(",")[0].toLowerCase().replaceAll("#", "");
			const icon = pair.split(",")[1];
			const icon2 = pair.split(",")[2];
			if (tagName === tag && icon) superchargedIcon = icon + " ";
			else if (tagName === tag && icon2) superchargedIcon2 = " " + icon2;
		});
	}

	jsonArray.push({
		title: superchargedIcon + "#" + tagName + superchargedIcon2,
		subtitle: tagData.tagCount + "x" + mergeInfo,
		match: alfredMatcher(tagName) + " #" + alfredMatcher(tagName) + extraMatcher,
		uid: tagName,
		arg: tagName,
		mods: { cmd: { arg: tagQuery } },
	});
});

JSON.stringify({ items: jsonArray });
