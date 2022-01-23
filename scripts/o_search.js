#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

// Functions
function readFile (path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

function parentFolder (filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1).join("/");
}
function alfredMatcher (str) {
	return str.replace (/[-()_.]/g, " ") + " " + str;
}

// Import Data
const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const metadataJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/metadata.json";
const starredJSON = vaultPath + "/.obsidian/starred.json";
const recentJSON = vaultPath + "/.obsidian/workspace";
const ignoreFolder = $.getenv("search_ignore_folder").replace(/^\/|\/$/, "");
const jsonArray = [];

// either searches the vault, or a subfolder of the vault
let currentFolder;
let pathToCheck;
try {
	currentFolder = $.getenv("browse_folder");
	pathToCheck = vaultPath + "/" + currentFolder;
	if (pathToCheck.endsWith("//")) pathToCheck = vaultPath; // when going back up from child of vault root
} catch (error) {
	pathToCheck = vaultPath;
}

// folder search
let folderArray = app.doShellScript("find \"" + pathToCheck + "\" -type d -mindepth 1 -not -path \"*/.*\"")
	.split("\r");
if (folderArray === "") folderArray = [];
if (ignoreFolder) folderArray = folderArray.filter (fo => !fo.startsWith(vaultPath + "/" + ignoreFolder));

// file search
let fileArray = JSON.parse (readFile(metadataJSON));
if (ignoreFolder) fileArray = fileArray.filter (f => !f.relativePath.startsWith(ignoreFolder));
if (pathToCheck !== vaultPath) fileArray = fileArray.filter (f => f.relativePath.startsWith(currentFolder));

// starred & recent files
let starredFiles = [];
if (readFile(starredJSON) !== "") {
	starredFiles =
		JSON.parse(readFile(starredJSON))
			.items
			.filter (item => item.type === "file")
			.map (item => item.path);
}
const recentFiles = JSON.parse(readFile(recentJSON)).lastOpenFiles;

// ignored headings
const hLVLignore = $.getenv("h_lvl_ignore");
const headingIgnore = [true];
for (let i = 1; i < 7; i++) {
	if (hLVLignore.includes (i.toString())) headingIgnore.push (true);
	else headingIgnore.push (false);
}

// files
fileArray.forEach(file => {
	const filename = file.fileName;
	const relativePath = file.relativePath;
	const absolutePath = vaultPath + "/" + relativePath;

	let tagMatcher = "";
	if (file.tags) tagMatcher = " #" + file.tags.join(" #");

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
	if (filename.toLowerCase().includes("to do")) emoji += "☑️ ";
	if (filename.toLowerCase().includes("template")) emoji += "📄 ";
	if (filename.toLowerCase().includes("inbox")) emoji += "📥 ";
	if (filename.toLowerCase().includes("moc")) emoji += "🗺 ";

	// check link existence of file
	let hasLinks = Boolean (file.links?.some(l => l.relativePath) || file.backlinks ); // no relativePath => unresolved link
	if (!hasLinks) hasLinks = /\[.*?\]\(.+?\)/.test(readFile(absolutePath)); // readFile only executed when no other links found for performance
	let linksSubtitle = "⛔️ Note without Outgoing Links or Backlinks";
	if (hasLinks) linksSubtitle = "⇧: Browse Links in Note";

	// Notes (file names)
	jsonArray.push({
		"title": emoji + filename,
		"match": alfredMatcher(filename) + tagMatcher + " filename name title",
		"subtitle": "▸ " + parentFolder(relativePath),
		"arg": relativePath,
		"quicklookurl": absolutePath,
		"type": "file:skipcheck",
		"uid": relativePath,
		"icon": { "path": iconpath },
		"mods": {
			"shift": {
				"valid": hasLinks,
				"subtitle": linksSubtitle
			}
		}
	});

	// Aliases
	if (file.aliases) {
		file.aliases.forEach(alias => {
			jsonArray.push({
				"title": alias,
				"match": additionalMatcher + "alias " + alfredMatcher(alias),
				"subtitle": "↪ " + filename,
				"arg": relativePath,
				"quicklookurl": absolutePath,
				"type": "file:skipcheck",
				"uid": alias + "_" + relativePath,
				"icon": { "path": "icons/alias.png" },
				"mods": {
					"shift": {
						"valid": hasLinks,
						"subtitle": linksSubtitle
					}
				}
			});
		});
	}

	// Headings
	if (!file.headings) return; // skips iteration if no heading
	file.headings.forEach(heading => {
		const hName = heading.heading;
		const lvl = heading.level;
		if (headingIgnore[lvl]) return; // skips iteration if heading has been configured as ignore
		iconpath = "icons/headings/h" + lvl.toString() + ".png";
		const matchStr =
			"h" + lvl.toString() + " " +
			alfredMatcher(hName) + " ";

		jsonArray.push({
			"title": hName,
			"match": matchStr,
			"subtitle": "➣ " + filename,
			"arg": relativePath + "#" + hName,
			"quicklookurl": absolutePath,
			"type": "file:skipcheck",
			"uid": hName + "_" + relativePath,
			"icon": { "path": iconpath },
			"mods": {
				"shift": {
					"valid": hasLinks,
					"subtitle": linksSubtitle,
					"arg": relativePath
				},
				"alt": { "arg": relativePath }
			}
		});
	});
});

// folders
folderArray.forEach(absolutePath => {
	const name = absolutePath.split("/").pop();
	const relativePath = absolutePath.slice(vaultPath.length + 1);

	jsonArray.push({
		"title": name,
		"match": alfredMatcher(name) + " folder",
		"subtitle": "▸ " + parentFolder(relativePath) + "   [↵: Browse]",
		"arg": relativePath,
		"type": "file:skipcheck",
		"uid": relativePath,
		"icon": { "path": "icons/folder.png" },
		"mods": {
			"cmd": {
				"valid": false,
				"subtitle": "⛔️ Cannot open folders",
			},
			"shift": {
				"valid": false,
				"subtitle": "⛔️ Folders have no links.",
			},
			"ctrl": {
				"valid": false,
				"subtitle": "⛔️ Linking not possible for folders",
			},
			"fn": {
				"valid": false,
				"subtitle": "⛔️ Cannot append to folders.",
			}
		}
	});
});

// Additional options when browsing a folder
if (pathToCheck !== vaultPath) {

	// New File in Folder
	jsonArray.push({
		"title": "Create new Note in here",
		"subtitle": "▸ " + currentFolder,
		"arg": "new",
		"icon": { "path": "icons/new.png" },
	});

	// go up to parent folder
	jsonArray.push({
		"title": "⬆️ Up to Parent Folder",
		"match": "up back parent folder directory browse .. cd",
		"subtitle": "▸ " + parentFolder(currentFolder),
		"arg": parentFolder(currentFolder),
		"icon": { "path": "icons/folder.png" },
	});
}

JSON.stringify({ items: jsonArray });
