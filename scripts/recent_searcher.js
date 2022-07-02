#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
const externalLinkRegex = /\[[^\]]*\]\([^)]+\)/;

// Functions
function parentFolder (filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1)
		.join("/");
}
function alfredMatcher (str) {
	return " " + str.replace (/[-()_.@]/g, " ") + " " + str + " ";
}
function readFile (path, encoding) {
	!encoding && (encoding = $.NSUTF8StringEncoding);
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const metadataJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/metadata.json";
const starredJSON = vaultPath + "/.obsidian/starred.json";
const recentJSON = vaultPath + "/.obsidian/workspace";
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
if (readFile(starredJSON) !== "") {
	starredFiles = JSON.parse(readFile(starredJSON))
		.items
		.filter (item => item.type === "file")
		.map (item => item.path);
}

const recentFiles = JSON.parse(readFile(recentJSON)).lastOpenFiles;

// filter the metadataJSON for the items w/ relativePaths of starred files
const fileArray = JSON.parse(readFile(metadataJSON))
	.filter(item => recentFiles.includes(item.relativePath));

fileArray.forEach(file => {
	const filename = file.fileName;
	const relativePath = file.relativePath;
	const absolutePath = vaultPath + "/" + relativePath;

	// icon & type dependent actions
	let iconpath = "icons/note.png";
	let emoji = "🕑 ";
	let additionalMatcher = "";
	if (starredFiles.includes(relativePath))	{
		emoji += "⭐️ ";
		additionalMatcher += "starred ";
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
	if (!hasLinks) hasLinks = externalLinkRegex.test(readFile(absolutePath)); // readFile only executed when no other links found for performance
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
