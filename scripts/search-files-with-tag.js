#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/** @param {string} filePath */
function parentFolder (filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1).join("/");
}
const alfredMatcher = (str) => str.replace (/[-()_.]/g, " ") + " " + str;
const fileExists = (filePath) => Application("Finder").exists(Path(filePath));

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

//──────────────────────────────────────────────────────────────────────────────

function getVaultPath() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
}
const vaultPath = getVaultPath();
const metadataJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/metadata.json";
const starredJSON = vaultPath + "/.obsidian/starred.json";
const superIconFile = $.getenv("supercharged_icon_file").replace(/^~/, app.pathTo("home folder"));

let recentJSON = vaultPath + "/.obsidian/workspace.json";
if (!fileExists(recentJSON)) recentJSON = recentJSON.slice(0, -5); // Obsidian 0.16 uses workspace.json → https://discord.com/channels/686053708261228577/716028884885307432/1013906018578743478

const recentFiles = fileExists(recentJSON) ? JSON.parse(readFile(recentJSON)).lastOpenFiles : [];
console.log("recentFiles length: " + recentFiles.length);

let starredFiles = [];
if (fileExists(starredJSON)) {
	starredFiles = JSON.parse(readFile(starredJSON))
		.items.filter(item => item.type === "file")
		.map(item => item.path);
}
console.log("starredFiles length: " + starredFiles.length);

let superIconList = [];
if (superIconFile && fileExists(superIconFile)) {
	superIconList = readFile(superIconFile)
		.split("\n")
		.filter(l => l.length !== 0);
}
console.log("superIconList length: " + superIconList.length);

const jsonArray = [];

//──────────────────────────────────────────────────────────────────────────────

const mergeNestedTags = $.getenv("merge_nested_tags") === "1";

// filter the metadataJSON for the items w/ relativePaths of tagged files
let selectedTag = $.getenv("selectedTag")
if (mergeNestedTags) selectedTag = selectedTag.split("/")[0];

let fileArray = JSON.parse(readFile(metadataJSON)).filter(j => j.tags);
if (mergeNestedTags) { 
	fileArray = fileArray.filter(f => {
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
	let superchargedIcon2 = "";
	if (superIconList.length > 0 && file.tags) {
		superIconList.forEach(pair => {
			const tag = pair.split(",")[0].toLowerCase().replaceAll("#", "");
			const icon = pair.split(",")[1];
			const icon2 = pair.split(",")[2];
			if (file.tags.includes(tag) && icon) superchargedIcon = icon + " ";
			else if (file.tags.includes(tag) && icon2) superchargedIcon2 = " " + icon2;
		});
	}

	// check link existence of file
	let hasLinks = Boolean (file.links?.some(l => l.relativePath) || file.backlinks ); // no relativePath => unresolved link
	if (!hasLinks) hasLinks = /\[.*?\]\(.+?\)/.test(readFile(absolutePath)); // readFile only executed when no other links found for performance
	let linksSubtitle = "⛔️ Note without Outgoing Links or Backlinks";
	if (hasLinks) linksSubtitle = "⇧: Browse Links in Note";

	// exclude cssclass: private
	let displayName = filename;
	const censorChar = $.getenv("censor_char");
	const isPrivateNote = file.frontmatter?.cssclass?.includes("private");
	const privacyModeOn = $.getenv("privacy_mode") === "1";
	const applyCensoring = isPrivateNote && privacyModeOn;
	if (applyCensoring) displayName = filename.replace(/./g, censorChar);

	// push result
	jsonArray.push({
		"title": emoji + superchargedIcon + displayName + superchargedIcon2,
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
				"subtitle": linksSubtitle,
			},
		},
	});
});

JSON.stringify({ items: jsonArray });
