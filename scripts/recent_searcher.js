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

function readFile (path, encoding) {
	!encoding && (encoding = $.NSUTF8StringEncoding);
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

//------------------------------------------------------------------------------

function getVaultPath() {
	const _app = Application.currentApplication();
	_app.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
}
const vaultPath = getVaultPath()
const metadataJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/metadata.json";
const starredJSON = vaultPath + "/.obsidian/starred.json";
let recentJSON = vaultPath + "/.obsidian/workspace.json";
if (!fileExists(recentJSON)) recentJSON = recentJSON.slice(0, -5); // Obsidian 0.16 uses workspace.json → https://discord.com/channels/686053708261228577/716028884885307432/1013906018578743478
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

// filter the metadataJSON for the items w/ relativePaths of recent files
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
	let superchargedIcon2 = "";
	if (superchargedIconFileExists && file.tags) {
		superchargedIconList.forEach(pair => {
			const tag = pair.split(",")[0].toLowerCase().replaceAll("#", "");
			const icon = pair.split(",")[1];
			const icon2 = pair.split(",")[2];
			if (file.tags.includes(tag) && icon) superchargedIcon = icon + " ";
			else if (file.tags.includes(tag) && icon2) superchargedIcon2 = " " + icon2;
		});
	}

	// check link existence of file
	let hasLinks = Boolean (file.links?.some(l => l.relativePath) || file.backlinks ); // no relativePath => unresolved link
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
