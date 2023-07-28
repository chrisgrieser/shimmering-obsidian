#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
const externalLinkRegex = /\[[^\]]*\]\([^)]+\)/;

function parentFolder (filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1)
		.join("/");
}
const alfredMatcher = (str) => str.replace (/[-()_.]/g, " ") + " " + str;
const fileExists = (filePath) => Application("Finder").exists(Path(filePath));

function readFile (path) {
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
const bookmarkJSON = vaultPath + "/.obsidian/bookmarks.json";
const superIconFile = $.getenv("supercharged_icon_file").replace(/^~/, app.pathTo("home folder"));

let recentJSON = vaultPath + "/.obsidian/workspace.json";
if (!fileExists(recentJSON)) recentJSON = recentJSON.slice(0, -5); // Obsidian 0.16 uses workspace.json → https://discord.com/channels/686053708261228577/716028884885307432/1013906018578743478

const recentFiles = fileExists(recentJSON) ? JSON.parse(readFile(recentJSON)).lastOpenFiles : [];
console.log("recentFiles length: " + recentFiles.length);

//──────────────────────────────────────────────────────────────────────────────
// bookmarks & stars
let stars = [];
const bookmarks = [];
if (fileExists(starredJSON)) {
	stars = JSON.parse(readFile(starredJSON))
		.items.filter(item => item.type === "file")
		.map(item => item.path);
}

function bmFlatten(input, collector) {
	input.forEach(item => {
		if (item.type === "file") collector.push(item.path);
		if (item.type === "group") bmFlatten(item.items, collector);
	});
}

if (fileExists(bookmarkJSON)) {
	const bookm = JSON.parse(readFile(bookmarkJSON)).items;
	bmFlatten(bookm, bookmarks);
}
const starsAndBookmarks = [...new Set([...stars, ...bookmarks])]

//──────────────────────────────────────────────────────────────────────────────

let superIconList = [];
if (superIconFile && fileExists(superIconFile)) {
	superIconList = readFile(superIconFile)
		.split("\n")
		.filter(line => line.length !== 0);
}

const jsonArray = [];
//──────────────────────────────────────────────────────────────────────────────

// filter the metadataJSON for the items w/ relativePaths of recent files
const fileArray = JSON.parse(readFile(metadataJSON))
	.filter(item => recentFiles.includes(item.relativePath));

//──────────────────────────────────────────────────────────────────────────────
fileArray.forEach(file => {
	const filename = file.fileName;
	const relativePath = file.relativePath;
	const absolutePath = vaultPath + "/" + relativePath;

	// icon & type dependent actions
	let iconpath = "icons/note.png";
	let emoji = "🕑 ";
	let additionalMatcher = "";
	if (starsAndBookmarks.includes(relativePath))	{
		emoji += "🔖 ";
		additionalMatcher += "starred bookmark ";
	}
	if ($.getenv("remove_emojis") === "1") emoji = "";
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
	let hasLinks = Boolean (file.links?.some(line => line.relativePath) || file.backlinks ); // no relativePath => unresolved link
	if (!hasLinks) hasLinks = externalLinkRegex.test(readFile(absolutePath)); // readFile only executed when no other links found for performance
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
