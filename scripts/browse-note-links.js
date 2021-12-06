#!/usr/bin/env osascript -l JavaScript

function run () { /* exported run */
	ObjC.import("stdlib");
	ObjC.import("Foundation");
	app = Application.currentApplication();
	app.includeStandardAdditions = true;

	// Functions
	const readFile = function (path, encoding) {
		!encoding && (encoding = $.NSUTF8StringEncoding);
		const fm = $.NSFileManager.defaultManager;
		const data = fm.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
		return ObjC.unwrap(str);
	};

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
	const jsonArray = [];

	// create input note JSON
	// Caveat: the try scope is needed for special characters,
	// but iconv can't handle emojis, while normal getenv can't handle special
	// characters. So a filename with special characters AND emojis
	// will not be handled properly.
	let inputPath = "";
	try {
		inputPath = app.doShellScript ("echo '" + $.getenv("input_path") + "' | iconv -f UTF-8-MAC -t MACROMAN");
	}	catch (error) {
		inputPath = $.getenv("input_path");
	}

	const metaJSON = JSON.parse(readFile(metadataJSON));
	const inputNoteJSON =
		metaJSON.filter(n => n.relativePath.includes(inputPath))[0];

	// create list of links and backlinks and merge them
	let bothLinksList = [];
	let linkList = [];
	let backlinkList = [];
	if (inputNoteJSON.links) {
		linkList =
			inputNoteJSON
				.links
				.filter(l => l.relativePath)
				.map(item => item.relativePath);
		bothLinksList.push (...linkList);
	}
	if (inputNoteJSON.backlinks) {
		backlinkList =
			inputNoteJSON
				.backlinks
				.map(item => item.relativePath);
		bothLinksList.push (...backlinkList);
	}
	bothLinksList = [...new Set(bothLinksList)]; // only unique items

	// get starred and recent files
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

	// get external links
	let externalLinkList =
		readFile(vaultPath + "/" + inputPath)
			.match (/\[(?! ]).*?\]\(.*?\)/g); // prevents links in markdown tasks from matching
	if (externalLinkList) {
		externalLinkList =	externalLinkList.map (mdlink => [
			mdlink.split("](")[0].slice(1),
			mdlink.split("](")[1].slice(0, -1)
		]);
	} else {
		externalLinkList = [];
	}

	// guard clause if no links of any sort (should only occur with "ol" command though)
	// -----------------------------
	if (!bothLinksList && !externalLinkList) {
		jsonArray.push({
			"title": "No links recognized in the file.",
			"subtitle": "Press [Esc] to abort."
		});
		return JSON.stringify({ items: jsonArray });
	}


	// create JSON for Script Filter
	// -----------------------------
	const fileArray = metaJSON
		.filter(item => bothLinksList.includes(item.relativePath));

	fileArray.forEach(file => {
		const filename = file.fileName;
		const relativePath = file.relativePath;

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
			const externalLinkList_ =
				readFile(vaultPath + "/" + relativePath)
					.match (/\[.*?\]\(.*?\)/); // no g-flag, since existence of 1 link sufficient
			if (externalLinkList_) {
				hasLinks = true;
				linksSubtitle = linksExistent;
			}
		}

		// >> icon & emojis
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

		// >> emojis dependent on link type
		let linkIcon = "";
		if (linkList.includes (relativePath)) linkIcon += "🔗 ";
		if (backlinkList.includes (relativePath)) linkIcon += "⬅️ ";

		jsonArray.push({
			"title": linkIcon + emoji + filename,
			"match": additionalMatcher + alfredMatcher(filename),
			"subtitle": "▸ " + parentFolder(relativePath),
			"type": "file:skipcheck",
			"quicklookurl": vaultPath + "/" + relativePath,
			"uid": relativePath,
			"arg": relativePath,
			"icon": { "path": iconpath },
			"mods": {
				"shift": {
					"valid": hasLinks,
					"subtitle": linksSubtitle
				},
			},
		});
	});

	// add external Links to Script-Filter JSON
	externalLinkList.forEach(link => {
		const title = link[0];
		const url = link[1];
		const invalidSubtitle = "⛔️ Cannot do that with external link.";

		jsonArray.push({
			"title": title,
			"match": "external " + alfredMatcher(title) + " " + url,
			"subtitle": url,
			"uid": url,
			"arg": url,
			"icon": { "path": "icons/external_link.png" },
			"mods": {
				"shift": {
					"valid": false,
					"subtitle": invalidSubtitle,
				},
				"fn": {
					"valid": false,
					"subtitle": invalidSubtitle,
				},
				"cmd": {
					"valid": false,
					"subtitle": invalidSubtitle,
				},
				"ctrl": {
					"valid": false,
					"subtitle": invalidSubtitle,
				},
				"alt": { "subtitle": "⌥: Copy URL" },
			},
		});
	});


	return JSON.stringify({ items: jsonArray });
}
