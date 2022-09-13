#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function parentFolder (filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1)
		.join("/");
}
const alfredMatcher = (str) => str.replace (/[-()_.]/g, " ") + " " + str;
const fileExists = (filePath) => Application("Finder").exists(Path(filePath));

function readFile (path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

//------------------------------------------------------------------------------

const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const metadataJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/metadata.json";
const starredJSON = vaultPath + "/.obsidian/starred.json";
let recentJSON = vaultPath + "/.obsidian/workspace.json";
if (!fileExists(recentJSON)) recentJSON = recentJSON.slice(0, -5); // Obsidian 0.16 uses workspace.json → https://discord.com/channels/686053708261228577/716028884885307432/1013906018578743478
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

let starredFiles = [];
if (readFile(starredJSON) !== "") { starredFiles = JSON.parse(readFile(starredJSON))
	.items
	.filter (s => s.type === "file")
	.map (s => s.path);
}

const recentFiles = JSON.parse(readFile(recentJSON)).lastOpenFiles;

// filter the metadataJSON for the items w/ relativePaths of tagged files
let selectedTag = readFile($.getenv("alfred_workflow_data") + "/buffer_selectedTag");
if (mergeNestedTags) selectedTag = selectedTag.split("/")[0];

let fileArray = JSON.parse(readFile(metadataJSON)).filter(j => j.tags);
if (mergeNestedTags) { fileArray = fileArray
	.filter(function (f) {
		let hasParentTag = false;
		f.tags.forEach(tag => {
			if (tag.startsWith(selectedTag + "/") || tag === selectedTag) hasParentTag = true;
		});
		return hasParentTag;
	});
}
else fileArray = fileArray.filter(j => j.tags.includes(selectedTag));


fileArray.forEach(file => {
	const filename = file.fileName;
	const relativePath = file.relativePath;
	const absolutePath = vaultPath + "/" + relativePath;

	// icon & emojis
	let iconpath = "icons/note.png";
	let emoji = "";
	let additionalMatcher = "";
	if (starredFiles.includes(relativePath))	{
		emoji += "⭐️ ";
		additionalMatcher += "starred ";
	}
	if (recentFiles.includes(relativePath)) {
		emoji += "🕑 ";
		additionalMatcher += "recent ";
	}
	if (filename.toLowerCase().includes("kanban"))	iconpath = "icons/kanban.png";

	let superchargedIcon = "";
	if (superchargedIconFileExists && file.tags) {
		superchargedIconList.forEach(pair => {
			const tag = pair.split(",")[0].toLowerCase().replaceAll("#", "");
			const icon = pair.split(",")[1];
			if (file.tags.includes(tag)) superchargedIcon = icon + " ";
		});
	}

	// check link existence of file
	let hasLinks = Boolean (file.links?.some(l => l.relativePath) || file.backlinks ); // no relativePath => unresolved link
	if (!hasLinks) hasLinks = /\[.*?\]\(.+?\)/.test(readFile(absolutePath)); // readFile only executed when no other links found for performance
	let linksSubtitle = "⛔️ Note without Outgoing Links or Backlinks";
	if (hasLinks) linksSubtitle = "⇧: Browse Links in Note";

	// push result
	jsonArray.push({
		"title": emoji + superchargedIcon + filename,
		"match": additionalMatcher + alfredMatcher(filename),
		"subtitle": "▸ " + parentFolder(relativePath),
		"arg": relativePath,
		"quicklookurl": vaultPath + "/" + relativePath,
		"type": "file:skipcheck",
		"uid": relativePath,
		"icon": { "path": iconpath },
		"mods": {
			"shift": {
				"valid": hasLinks,
				"subtitle": linksSubtitle
			},
		},
	});
});

JSON.stringify({ items: jsonArray });
