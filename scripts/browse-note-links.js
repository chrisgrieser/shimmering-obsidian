#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

/** @param {string} filePath */
function parentFolder(filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1).join("/");
}

/** @param {string} str */
function alfredMatcher(str) {
	const clean = str.replace(/[-()_.:#/\\;,[\]]/g, " ");
	return [clean, str].join(" ") + " ";
}
const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

/** @param {string} appId */
function SafeApplication(appId) {
	try {
		return Application(appId);
	} catch (_error) {
		return null;
	}
}

const discordReadyLinks = ["Discord", "Discord PTB", "Discord Canary"].some((discordApp) =>
	SafeApplication(discordApp)?.frontmost(),
);

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");
	const externalLinkRegex = /\[[^\]]*\]\([^)]+\)/g;
	const singleExternalLinkRegex = /\[[^\]]*\]\([^)]+\)/;

	// Import Data
	const metadataJSON = `${vaultPath}/${configFolder}/plugins/metadata-extractor/metadata.json`;
	const starredJSON = `${vaultPath}/${configFolder}/starred.json`;
	const bookmarkJSON = `${vaultPath}/${configFolder}/bookmarks.json`;
	let recentJSON = `${vaultPath}/${configFolder}/workspace.json`;
	if (!fileExists(recentJSON)) recentJSON = recentJSON.slice(0, -5); // Obsidian 0.16 uses workspace.json → https://discord.com/channels/686053708261228577/716028884885307432/1013906018578743478
	const superIconFile = $.getenv("supercharged_icon_file");

	//───────────────────────────────────────────────────────────────────────────

	// ICONS
	// Recent Files
	const recentFiles = fileExists(recentJSON) ? JSON.parse(readFile(recentJSON)).lastOpenFiles : [];

	// Supercharged Icons File
	let superIconList = [];
	if (superIconFile && fileExists(superIconFile)) {
		superIconList = readFile(superIconFile)
			.split("\n")
			.filter((line) => line.length !== 0);
	}

	// bookmarks & stars
	let stars = [];
	const bookmarks = [];
	if (fileExists(starredJSON)) {
		stars = JSON.parse(readFile(starredJSON))
			.items.filter((/** @type {{ type: string; }} */ item) => item.type === "file")
			.map((/** @type {{ path: string; }} */ item) => item.path);
	}

	/**
	 * @param {any[]} input
	 * @param {any[]} collector
	 */
	function bmFlatten(input, collector) {
		input.forEach((item) => {
			if (item.type === "file") collector.push(item.path);
			if (item.type === "group") bmFlatten(item.items, collector);
		});
	}

	if (fileExists(bookmarkJSON)) {
		const bookm = JSON.parse(readFile(bookmarkJSON)).items;
		bmFlatten(bookm, bookmarks);
	}
	const starsAndBookmarks = [...new Set([...stars, ...bookmarks])];

	//───────────────────────────────────────────────────────────────────────────

	// create input note JSON
	const allLinksArr = [];
	const inputPath = $.getenv("inputPath");

	const metaJSON = JSON.parse(readFile(metadataJSON));
	const inputNoteJSON = metaJSON.filter((/** @type {{ relativePath: string}} */ note) =>
		note.relativePath.includes(inputPath),
	)[0];

	// create list of links and backlinks and merge them
	let bothLinksList = [];
	let linkList = [];
	let backlinkList = [];
	if (inputNoteJSON.links) {
		linkList = inputNoteJSON.links
			.filter((/** @type {{ relativePath: string; }} */ line) => line.relativePath)
			.map((/** @type {{ relativePath: string; }} */ item) => item.relativePath);
		bothLinksList.push(...linkList);
	}
	if (inputNoteJSON.backlinks) {
		backlinkList = inputNoteJSON.backlinks.map(
			(/** @type {{ relativePath: string; }} */ item) => item.relativePath,
		);
		bothLinksList.push(...backlinkList);
	}
	bothLinksList = [...new Set(bothLinksList)]; // only unique items

	// get external links
	const externalLinks = readFile(vaultPath + "/" + inputPath).match(externalLinkRegex) || [];
	const externalLinkList = externalLinks.map((mdlink) => {
		const [title, url] = mdlink.split("](");
		return {
			title: title.slice(1),
			url: url.slice(0, -1),
		};
	});

	//───────────────────────────────────────────────────────────────────────────
	// create JSON for Script Filter

	// file array
	metaJSON
		.filter((/** @type {{ relativePath: string; }} */ item) =>
			bothLinksList.includes(item.relativePath),
		)
		.forEach(
			(
				/** @type {{ fileName: string; relativePath: string; links: any[]; backlinks: any[]; tags: string[]; frontmatter: { cssclass: string | string[]; }; }} */ file,
			) => {
				const filename = file.fileName;
				const relativePath = file.relativePath;
				const absolutePath = vaultPath + "/" + relativePath;

				// check link existence of file
				let hasLinks = Boolean(file.links?.some((line) => line.relativePath) || file.backlinks); // no relativePath => unresolved link
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
				if ($.getenv("remove_emojis") === "1") emoji = "";
				if (filename.toLowerCase().includes("kanban")) iconpath = "icons/kanban.png";

				let superchargedIcon = "";
				let superchargedIcon2 = "";
				if (superIconList.length > 0 && file.tags) {
					superIconList.forEach((pair) => {
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

				allLinksArr.push({
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
			},
		);

	// add external Links to Script-Filter JSON
	externalLinkList.forEach((link) => {
		const title = link.title;
		const url = link.url;

		// URLs discord ready
		const isDiscordReady = discordReadyLinks ? " (discord ready)" : "";
		const shareURL = discordReadyLinks ? "<" + url + ">" : url;

		const modifierInvalid = {
			valid: false,
			subtitle: "⛔️ Cannot do that with external link.",
		};

		allLinksArr.push({
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

	if (allLinksArr.length === 0) {
		const basename = inputPath.split("/").slice(-1)[0].replace(/\.md$/, "");
		allLinksArr.push({
			title: `No links found in "${basename}"`,
			valid: false,
		});
	}

	return JSON.stringify({ items: allLinksArr });
}
