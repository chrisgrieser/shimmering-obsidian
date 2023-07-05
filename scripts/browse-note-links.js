#!/usr/bin/env osascript -l JavaScript

function run() {
	ObjC.import("stdlib");
	ObjC.import("Foundation");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const externalLinkRegex = /\[[^\]]*\]\([^)]+\)/g;
	const singleExternalLinkRegex = /\[[^\]]*\]\([^)]+\)/;

	function readFile(path) {
		const data = $.NSFileManager.defaultManager.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
		return ObjC.unwrap(str);
	}

	function parentFolder(filePath) {
		if (!filePath.includes("/")) return "/";
		return filePath.split("/").slice(0, -1).join("/");
	}

	const alfredMatcher = str => " " + str.replace(/[-()_/:.@]/g, " ") + " " + str + " ";
	const fileExists = filePath => Application("Finder").exists(Path(filePath));

	function SafeApplication(appId) {
		try {
			return Application(appId);
		} catch (error) {
			return null;
		}
	}

	const discordReadyLinks = ["Discord", "Discord PTB", "Discord Canary"].some(discordApp =>
		SafeApplication(discordApp)?.frontmost(),
	);
	function getVaultPath() {
		const theApp = Application.currentApplication();
		theApp.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
	}
	//───────────────────────────────────────────────────────────────────────────

	// Import Data
	const vaultPath = getVaultPath();
	const metadataJSON = vaultPath + "/.obsidian/plugins/metadata-extractor/metadata.json";
	const starredJSON = vaultPath + "/.obsidian/starred.json";
	const bookmarkJSON = vaultPath + "/.obsidian/bookmarks.json";
	let recentJSON = vaultPath + "/.obsidian/workspace.json";
	if (!fileExists(recentJSON)) recentJSON = recentJSON.slice(0, -5); // Obsidian 0.16 uses workspace.json → https://discord.com/channels/686053708261228577/716028884885307432/1013906018578743478
	const superIconFile = $.getenv("supercharged_icon_file").replace(/^~/, app.pathTo("home folder"));
	const jsonArray = [];

	// Supercharged Icons File
	let superIconList = [];
	if (superIconFile && fileExists(superIconFile)) {
		superIconList = readFile(superIconFile)
			.split("\n")
			.filter(line => line.length !== 0);
	}
	console.log("superIconList length: " + superIconList.length);

	//───────────────────────────────────────────────────────────────────────────

	// create input note JSON
	const inputPath = $.getenv("inputPath");
	console.log(inputPath);

	const metaJSON = JSON.parse(readFile(metadataJSON));
	const inputNoteJSON = metaJSON.filter(note => note.relativePath.includes(inputPath))[0];

	// create list of links and backlinks and merge them
	let bothLinksList = [];
	let linkList = [];
	let backlinkList = [];
	if (inputNoteJSON.links) {
		linkList = inputNoteJSON.links.filter(line => line.relativePath).map(item => item.relativePath);
		bothLinksList.push(...linkList);
	}
	if (inputNoteJSON.backlinks) {
		backlinkList = inputNoteJSON.backlinks.map(item => item.relativePath);
		bothLinksList.push(...backlinkList);
	}
	bothLinksList = [...new Set(bothLinksList)]; // only unique items

	//──────────────────────────────────────────────────────────────────────────────
	// BOOKMARKS & STARS
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
	const starsAndBookmarks = [...new Set([...stars, ...bookmarks])];
	console.log("starsAndBookmarks length:", starsAndBookmarks.length);

	//──────────────────────────────────────────────────────────────────────────────

	const recentFiles = fileExists(recentJSON) ? JSON.parse(readFile(recentJSON)).lastOpenFiles : [];

	// get external links
	let externalLinkList = readFile(vaultPath + "/" + inputPath).match(externalLinkRegex);
	if (externalLinkList) {
		externalLinkList = externalLinkList.map(mdlink => [
			mdlink.split("](")[0].slice(1),
			mdlink.split("](")[1].slice(0, -1),
		]);
	} else externalLinkList = [];

	// guard clause if no links of any sort (should only occur with "ol" command though)
	if (!bothLinksList.length && !externalLinkList.length) {
		jsonArray.push({
			title: "No links recognized in the file.",
			subtitle: "Press [Esc] to abort.",
		});
		return JSON.stringify({ items: jsonArray });
	}

	//───────────────────────────────────────────────────────────────────────────
	// create JSON for Script Filter

	const fileArray = metaJSON.filter(item => bothLinksList.includes(item.relativePath));

	fileArray.forEach(file => {
		const filename = file.fileName;
		const relativePath = file.relativePath;
		const absolutePath = vaultPath + "/" + relativePath;

		// check link existence of file
		let hasLinks = Boolean(file.links?.some(line => line.relativePath) || file.backlinks); // no relativePath => unresolved link
		if (!hasLinks) hasLinks = singleExternalLinkRegex.test(readFile(absolutePath)); // readFile only executed when no other links found for performance
		let linksSubtitle = "⛔️ Note without Outgoing Links or Backlinks";
		if (hasLinks) linksSubtitle = "⇧: Browse Links in Note";

		// icon & emojis
		let iconpath = "icons/note.png";
		let emoji = "";
		let additionalMatcher = "";
		if (starsAndBookmarks.includes(relativePath)) {
			emoji += "🔖 ";
			additionalMatcher += "starred bookmark ";
		}
		if (recentFiles.includes(relativePath)) {
			emoji += "🕑 ";
			additionalMatcher += "recent ";
		}
		if (filename.toLowerCase().includes("kanban")) iconpath = "icons/kanban.png";

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

		// emojis dependent on link type
		let linkIcon = "";
		if (linkList.includes(relativePath)) linkIcon += "🔗 ";
		if (backlinkList.includes(relativePath)) linkIcon += "⬅️ ";

		// exclude cssclass: private
		let displayName = filename;
		const censorChar = $.getenv("censor_char");
		const isPrivateNote = file.frontmatter?.cssclass?.includes("private");
		const privacyModeOn = $.getenv("privacy_mode") === "1";
		const applyCensoring = isPrivateNote && privacyModeOn;
		if (applyCensoring) displayName = filename.replace(/./g, censorChar);

		jsonArray.push({
			title: linkIcon + emoji + superchargedIcon + displayName + superchargedIcon2,
			match: additionalMatcher + alfredMatcher(filename),
			subtitle: "▸ " + parentFolder(relativePath),
			type: "file:skipcheck",
			quicklookurl: vaultPath + "/" + relativePath,
			uid: relativePath,
			arg: relativePath,
			icon: { path: iconpath },
			mods: {
				shift: {
					valid: hasLinks,
					subtitle: linksSubtitle,
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
			valid: false,
			subtitle: "⛔️ Cannot do that with external link.",
		};

		jsonArray.push({
			title: title,
			match: "external" + alfredMatcher(title) + alfredMatcher(url),
			subtitle: url,
			uid: url,
			arg: url,
			icon: { path: "icons/external_link.png" },
			mods: {
				shift: modifierInvalid,
				fn: modifierInvalid,
				cmd: modifierInvalid,
				ctrl: modifierInvalid,
				alt: {
					arg: shareURL,
					subtitle: "⌥: Copy URL" + isDiscordReady,
				},
			},
		});
	});

	return JSON.stringify({ items: jsonArray });
}
