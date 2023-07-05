#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

/** @param {string} str */
function alfredMatcher(str) {
	const clean = str.replace(/[-_.#]/g, " ");
	const camelCaseSeperated = str.replace(/([A-Z])/g, " $1");
	return [clean, camelCaseSeperated, str].join(" ") + " ";
}

//──────────────────────────────────────────────────────────────────────────────

function getVaultPath() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath(
		$.getenv("alfred_workflow_data") + "/vaultPath",
	);
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
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
		.filter((line) => line.length !== 0);
}
console.log("superIconList length: " + superIconList.length);

function getVaultNameEncoded() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath(
		$.getenv("alfred_workflow_data") + "/vaultPath",
	);
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const theVaultPath = ObjC.unwrap(vault);
	const vaultName = theVaultPath.replace(/.*\//, "");
	return encodeURIComponent(vaultName);
}
const vaultNameEnc = getVaultNameEncoded();

//──────────────────────────────────────────────────────────────────────────────

let tagsArray = JSON.parse(readFile(tagsJSON)).map((/** @type {{ merged: boolean; }} */ tag) => {
	tag.merged = false;
	return tag;
});

//──────────────────────────────────────────────────────────────────────────────

if (mergeNestedTags) {
	// reduce tag-key to the parent-tag.
	tagsArray = tagsArray.map((tag) => {
		tag.tag = tag.tag.split("/")[0];
		return tag;
	});

	// merge tag-object based on same tag-key https://stackoverflow.com/a/33850667
	const mergedTags = [];
	tagsArray.forEach((item) => {
		const existing = mergedTags.filter((j) => j.tag === item.tag);
		if (existing.length) {
			const mergeIndex = mergedTags.indexOf(existing[0]);
			mergedTags[mergeIndex].tagCount += item.tagCount;
			mergedTags[mergeIndex].merged = true;
		} else mergedTags.push(item);
	});
	tagsArray = mergedTags;
}

tagsArray.forEach((tagData) => {
	const tagName = tagData.tag;
	const tagQuery =
		"obsidian://search?vault=" + vaultNameEnc + "&query=" + encodeURIComponent("tag:#" + tagName);

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
		superIconList.forEach((pair) => {
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
		match: alfredMatcher("#" + tagName) + extraMatcher,
		uid: tagName,
		mods: { cmd: { arg: tagQuery } },
		// passed to next script filter
		arg: "",
		variables: { selectedTag: tagName },
	});
});

JSON.stringify({ items: jsonArray });
