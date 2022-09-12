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

const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const metadataJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/metadata.json";
const starredJSON = vaultPath + "/.obsidian/starred.json";
let recentJSON = vaultPath + "/.obsidian/workspace";
if (!fileExists(recentJSON)) recentJSON += ".json"; // Obsidian 0.16 uses workspace.json → https://discord.com/channels/686053708261228577/716028884885307432/1013906018578743478
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
	.filter(item => starredFiles.includes(item.relativePath));

const starredSearches = JSON.parse(readFile(starredJSON))
	.items
	.filter (item => item.type === "search")
	.map (item => item.query);


fileArray.forEach(file => {
	const filename = file.fileName;
	const relativePath = file.relativePath;
	const absolutePath = vaultPath + "/" + relativePath;

	// icon & type dependent actions
	let iconpath = "icons/note.png";
	let emoji = "⭐️ ";
	let additionalMatcher = "";
	if (recentFiles.includes(relativePath)) {
		emoji += "🕑 ";
		additionalMatcher += "recent ";
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

	// push result
	jsonArray.push({
		"title": emoji + superchargedIcon + filename + superchargedIcon2,
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


// Starred Searches
starredSearches.forEach(searchQuery => {
	const subtitle = "⛔️ Cannot do that with a starred search.";
	jsonArray.push({
		"title": "⭐️ " + searchQuery,
		"arg": "obsidian://search?vault=" + $.getenv("vault_name_ENC") + "t&query=" + searchQuery,
		"uid": searchQuery,
		"mods": {
			"fn": {
				"subtitle": subtitle,
				"valid": false,
			},
			"ctrl": {
				"subtitle": subtitle,
				"valid": false,
			},
			"cmd": {
				"subtitle": subtitle,
				"valid": false,
			},
			"alt": {
				"subtitle": subtitle,
				"valid": false,
			},
			"shift": {
				"subtitle": subtitle,
				"valid": false,
			},
		},
	});
});

JSON.stringify({ items: jsonArray });
