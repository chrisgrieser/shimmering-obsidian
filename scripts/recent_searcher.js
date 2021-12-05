#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;

// > Functions
function parentFolder (filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1).join("/");
}
function alfredMatcher (str) {
	return str.replace (/[-()_.]/g, " ") + " " + str;
}
const readFile = function (path, encoding) {
	!encoding && (encoding = $.NSUTF8StringEncoding);
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
};

const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const metadataJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/metadata.json";
const starredJSON = vaultPath + "/.obsidian/starred.json";
const recentJSON = vaultPath + "/.obsidian/workspace";
const jsonArray = [];

let starredFiles = [];
if (readFile(starredJSON) !== "") {
	starredFiles =
		JSON.parse(readFile(starredJSON))
			.items
			.filter (item => item.type === "file")
			.map (item => item.path);
}

const recentFiles =
	JSON.parse(readFile(recentJSON))
	.lastOpenFiles;

// filter the metadataJSON for the items w/ relativePaths of starred files
const fileArray =
	JSON.parse(readFile(metadataJSON))
		.filter(item => recentFiles.includes(item.relativePath));

// JSON Construction
fileArray.forEach(file => {

	const filename = file.fileName;
	const relativePath = file.relativePath;

	// icon & type dependent actions
	let iconpath = "icons/note.png";
	let emoji = "🕑 ";
	let additionalMatcher = "";
	if (starredFiles.includes(relativePath))	{
		emoji += "⭐️ ";
		additionalMatcher += "starred ";
	}
	if (filename.toLowerCase().includes("kanban"))	iconpath = "icons/kanban.png";
	if (filename.toLowerCase().includes("to do")) emoji += "☑️ ";
	if (filename.toLowerCase().includes("template")) emoji += "📄 ";
	if (filename.toLowerCase().includes("inbox")) emoji += "📥 ";
	if (filename.toLowerCase().includes("moc")) emoji += "🗺 ";

	// >> check link existence of file
	let hasLinks = false;
	let linksSubtitle = "⛔️ Note without Outgoing Links or Backlinks";
	const linksExistent = "⇧: Browse Links in Note";
	if (file.links) {
		if (file.links.some(l => l.relativePath)) {
			hasLinks = true;
			linksSubtitle = linksExistent;
		}
	} else if (file.backlinks) {
		hasLinks = true;
		linksSubtitle = linksExistent;
	} else {
		const externalLinkList =
			readFile(vaultPath + "/" + relativePath)
				.match (/\[.*?\]\(.*?\)/); // no g-flag, since existence of 1 link sufficient
		if (externalLinkList) {
			hasLinks = true;
			linksSubtitle = linksExistent;
		}
	}

	// push result
	jsonArray.push({
		"title": emoji + filename,
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


