#!/usr/bin/env osascript -l JavaScript

function run () {

	ObjC.import("stdlib");
	ObjC.import("Foundation");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const externalLinkRegex = /\[[^\]]*\]\([^)]+\)/g;
	const singleExternalLinkRegex = /\[[^\]]*\]\([^)]+\)/;

	function readFile (path, encoding) {
		if (!encoding) encoding = $.NSUTF8StringEncoding;
		const fm = $.NSFileManager.defaultManager;
		const data = fm.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
		return ObjC.unwrap(str);
	}

	function parentFolder (filePath) {
		if (!filePath.includes("/")) return "/";
		return filePath.split("/").slice(0, -1)
			.join("/");
	}

	const alfredMatcher = str => " " + str.replace (/[-()_/:.@]/g, " ") + " " + str + " ";
	const fileExists = (filePath) => Application("Finder").exists(Path(filePath));

	function SafeApplication(appId) {
		try {
			return Application(appId);
		} catch (e) {
			return null;
		}
	}

	const discordReadyLinks = ["Discord", "Discord PTB", "Discord Canary"]
		.some(discordApp => SafeApplication(discordApp)?.frontmost());

	//---------------------------------------------------------------------------

	// Import Data
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

	// ---------------------------

	// create input note JSON
	const inputPath = readFile($.getenv("alfred_workflow_data") + "/buffer_inputPath");
	console.log(inputPath);

	const metaJSON = JSON.parse(readFile(metadataJSON));
	const inputNoteJSON = metaJSON.filter(n => n.relativePath.includes(inputPath))[0];

	// create list of links and backlinks and merge them
	let bothLinksList = [];
	let linkList = [];
	let backlinkList = [];
	if (inputNoteJSON.links) {
		linkList = inputNoteJSON
			.links
			.filter(l => l.relativePath)
			.map(item => item.relativePath);
		bothLinksList.push (...linkList);
	}
	if (inputNoteJSON.backlinks) {
		backlinkList = inputNoteJSON
			.backlinks
			.map(item => item.relativePath);
		bothLinksList.push (...backlinkList);
	}
	bothLinksList = [...new Set(bothLinksList)]; // only unique items

	// get starred and recent files
	let starredFiles = [];
	if (readFile(starredJSON) !== "") {
		starredFiles = JSON.parse(readFile(starredJSON))
			.items
			.filter (item => item.type === "file")
			.map (item => item.path);
	}

	const recentFiles = JSON.parse(readFile(recentJSON)).lastOpenFiles;

	// get external links
	let externalLinkList = readFile(vaultPath + "/" + inputPath)
		.match (externalLinkRegex);
	if (externalLinkList) {
		externalLinkList = externalLinkList.map (mdlink => [
			mdlink.split("](")[0].slice(1),
			mdlink.split("](")[1].slice(0, -1)
		]);
	}
	else externalLinkList = [];


	// guard clause if no links of any sort (should only occur with "ol" command though)
	// -----------------------------------------------------
	if (!bothLinksList.length && !externalLinkList.length) {
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
		const absolutePath = vaultPath + "/" + relativePath;

		// check link existence of file
		let hasLinks = Boolean (file.links?.some(l => l.relativePath) || file.backlinks ); // no relativePath => unresolved link
		if (!hasLinks) hasLinks = singleExternalLinkRegex.test(readFile(absolutePath)); // readFile only executed when no other links found for performance
		let linksSubtitle = "⛔️ Note without Outgoing Links or Backlinks";
		if (hasLinks) linksSubtitle = "⇧: Browse Links in Note";

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
		if (superchargedIconFileExists && file.tags) {
			superchargedIconList.forEach(pair => {
				const tag = pair.split(",")[0].toLowerCase().replaceAll("#", "");
				const icon = pair.split(",")[1];
				const icon2 = pair.split(",")[2];
				if (file.tags.includes(tag) && icon) superchargedIcon = icon + " ";
				else if (file.tags.includes(tag) && icon2) superchargedIcon2 = " " + icon2;
			});
		}

		// emojis dependent on link type
		let linkIcon = "";
		if (linkList.includes (relativePath)) linkIcon += "🔗 ";
		if (backlinkList.includes (relativePath)) linkIcon += "⬅️ ";

		jsonArray.push({
			"title": linkIcon + emoji + superchargedIcon + filename + superchargedIcon2,
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

		// URLs discord ready
		let isDiscordReady;
		let shareURL;
		if (discordReadyLinks) {
			shareURL = "<" + url + ">";
			isDiscordReady = " (discord ready)";
		} else {
			isDiscordReady = "";
			shareURL = url;
		}

		const modifierInvalid = {
			"valid": false,
			"subtitle": "⛔️ Cannot do that with external link."
		};

		jsonArray.push({
			"title": title,
			"match": "external" + alfredMatcher(title) + alfredMatcher(url),
			"subtitle": url,
			"uid": url,
			"arg": url,
			"icon": { "path": "icons/external_link.png" },
			"mods": {
				"shift": modifierInvalid,
				"fn": modifierInvalid,
				"cmd": modifierInvalid,
				"ctrl": modifierInvalid,
				"alt": {
					"arg": shareURL,
					"subtitle": "⌥: Copy URL" + isDiscordReady
				},
			},
		});
	});

	return JSON.stringify({ items: jsonArray }); // JXA direct return not possible becuase of guard clause above
}
