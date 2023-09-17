#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

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
	const camelCaseSeperated = str.replace(/([A-Z])/g, " $1");
	return [clean, camelCaseSeperated, str].join(" ") + " ";
}

const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

//──────────────────────────────────────────────────────────────────────────────
// Read and Parse data

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");
	const vaultConfig = `${vaultPath}/${configFolder}`;

	const metadataJSON = `${vaultConfig}/plugins/metadata-extractor/metadata.json`;
	const canvasJSON = `${vaultConfig}/plugins/metadata-extractor/canvas.json`;
	const starredJSON = `${vaultConfig}/starred.json`;
	const bookmarkJSON = `${vaultConfig}/bookmarks.json`;
	const excludeFilterJSON = `${vaultConfig}/app.json`;
	const superIconFile = $.getenv("supercharged_icon_file");

	let recentJSON = `${vaultConfig}/workspace.json`;
	if (!fileExists(recentJSON)) recentJSON = recentJSON.slice(0, -5); // Obsidian 0.16 uses workspace.json → https://discord.com/channels/686053708261228577/716028884885307432/1013906018578743478

	const excludeFilter = fileExists(excludeFilterJSON)
		? JSON.parse(readFile(excludeFilterJSON)).userIgnoreFilters
		: [];

	const recentFiles = fileExists(recentJSON) ? JSON.parse(readFile(recentJSON)).lastOpenFiles : [];
	let canvasArray = fileExists(canvasJSON) ? JSON.parse(readFile(canvasJSON)) : [];

	//───────────────────────────────────────────────────────────────────────────
	// Main Metadata
	if (!fileExists(metadataJSON)) {
		return JSON.stringify({
			items: [
				{
					title: "🚫 No vault metadata found.",
					subtitle: "Please run the Alfred command `osetup` first. This only has to be done once.",
					valid: false,
				},
			],
		});
	}
	let fileArray = JSON.parse(readFile(metadataJSON));

	//──────────────────────────────────────────────────────────────────────────────
	// BOOKMARKS & STARS

	let stars = [];
	const bookmarks = [];
	if (fileExists(starredJSON)) {
		stars = JSON.parse(readFile(starredJSON))
			.items.filter((/** @type {{ type: string; }} */ item) => item.type === "file")
			.map((/** @type {{ path: any; }} */ item) => item.path);
	}

	/**
	 * @param {object[]} input
	 * @param {object[]} collector
	 */
	function bmFlatten(input, collector) {
		for (const item of input) {
			if (item.type === "file") collector.push(item.path);
			if (item.type === "group") bmFlatten(item.items, collector);
		}
	}

	if (fileExists(bookmarkJSON)) {
		const bookm = JSON.parse(readFile(bookmarkJSON)).items;
		bmFlatten(bookm, bookmarks);
	}
	const starsAndBookmarks = [...new Set([...stars, ...bookmarks])];

	//──────────────────────────────────────────────────────────────────────────────
	// ICONS
	let superIconList = [];
	if (superIconFile && fileExists(superIconFile)) {
		superIconList = readFile(superIconFile)
			.split("\n")
			.filter((line) => line.length !== 0);
	}

	//──────────────────────────────────────────────────────────────────────────────
	// DETERMINE PATH TO SEARCH
	let currentFolder;
	let pathToSearch;
	// either searches the vault, or a subfolder of the vault
	try {
		currentFolder = $.getenv("browse_folder");
		pathToSearch = vaultPath + "/" + currentFolder;
		if (pathToSearch.endsWith("//")) pathToSearch = vaultPath; // when going back up from child of vault root
	} catch (_error) {
		pathToSearch = vaultPath;
	}
	const isInSubfolder = pathToSearch !== vaultPath;

	// returns *absolute* paths
	let folderArray = app
		.doShellScript(`find "${pathToSearch}" -type d -mindepth 1 -not -path "*/.*"`)
		.split("\r");
	if (folderArray[0] === "") folderArray = [];

	//──────────────────────────────────────────────────────────────────────────────
	// EXCLUSION & IGNORING

	// if in subfolder, filter files outside subfolder
	if (isInSubfolder) {
		fileArray = fileArray.filter((/** @type {{ relativePath: string; }} */ file) =>
			file.relativePath.startsWith(currentFolder),
		);
		canvasArray = canvasArray.filter((/** @type {{ relativePath: string; }} */ file) =>
			file.relativePath.startsWith(currentFolder),
		);
		// INFO folderarray does not need to be filtered, since already filtered on creation
	}

	/**
	 * @param {object[]} array
	 * @param {boolean} isFolder
	 */
	function applyExcludeFilter(array, isFolder) {
		if (!excludeFilter || excludeFilter.length === 0 || array.length === 0) return array;
		return array.filter((item) => {
			let include = true;
			if (isFolder) item += "/";
			for (const filter of excludeFilter) {
				const isRegexFilter = filter.startsWith("/");
				const relPath = isFolder ? item.slice(vaultPath.length + 1) : item.relativePath;
				if (isRegexFilter && relPath.includes(filter)) include = false;
				if (!isRegexFilter && relPath.startsWith(filter)) include = false;
			}
			return include;
		});
	}

	folderArray = applyExcludeFilter(folderArray, true);
	canvasArray = applyExcludeFilter(canvasArray, false);
	fileArray = applyExcludeFilter(fileArray, false);

	// ignored headings
	const hLVLignore = $.getenv("h_lvl_ignore");
	const headingIgnore = [];
	for (let i = 1; i < 7; i++) {
		const shouldIgnore = hLVLignore.includes(i.toString());
		headingIgnore[i] = shouldIgnore;
	}

	// exclude cssclass: private
	const censorChar = $.getenv("censor_char");
	const privacyModeOn = $.getenv("privacy_mode") === "1";

	//──────────────────────────────────────────────────────────────────────────────
	// CONSTRUCTION OF JSON FOR ALFRED
	const resultsArr = [];

	// FILES
	for (const file of fileArray) {
		const filename = file.fileName;
		const relativePath = file.relativePath;
		const absolutePath = vaultPath + "/" + relativePath;
		const isBookmarked = starsAndBookmarks.includes(relativePath);
		const isRecent = recentFiles.includes(relativePath);

		// matching for Alfred
		const tagMatcher = file.tags ? " #" + file.tags.join(" #") : "";
		let additionalMatcher = "";
		if (isRecent) additionalMatcher += " recent";
		if (isBookmarked) additionalMatcher += " starred bookmarked";

		// pprioritization of sorting
		const prioritzedSorting = isRecent || isBookmarked;
		const insertVia = prioritzedSorting ? "unshift" : "push";

		// icon & emojis
		let iconpath = "icons/note.png";
		let emoji = "";
		if (isBookmarked) emoji += "🔖 ";
		if (isRecent) emoji += "🕑 ";
		if (filename.toLowerCase().includes("kanban")) iconpath = "icons/kanban.png";
		if ($.getenv("remove_emojis") === "1") emoji = "";

		let superchargedIcon = "";
		let superchargedIcon2 = "";
		if (superIconList.length > 0 && file.tags) {
			for (const pair of superIconList) {
				let [tag, icon, icon2] = pair.split(",");
				tag = tag.toLowerCase().replaceAll("#", "");
				if (file.tags.includes(tag) && icon) superchargedIcon = icon + " ";
				else if (file.tags.includes(tag) && icon2) superchargedIcon2 = " " + icon2;
			}
		}

		// check link existence of file
		const hasLinks = Boolean(
			file.links?.some((/** @type {{ relativePath: string; }} */ link) => link.relativePath) ||
				file.backlinks,
		); // no relativePath => unresolved link
		const linksSubtitle = hasLinks
			? "⇧: Browse Links in Note"
			: "⛔ Note without Outgoing Links or Backlinks";

		// censor note?
		const isPrivateNote = file.frontmatter?.cssclass?.includes("private");
		const applyCensoring = isPrivateNote && privacyModeOn;
		const displayName = applyCensoring ? filename.replace(/./g, censorChar) : filename;

		// Notes (file names)
		resultsArr[insertVia]({
			title: emoji + superchargedIcon + displayName + superchargedIcon2,
			match: alfredMatcher(filename) + tagMatcher + " filename name title" + additionalMatcher,
			subtitle: "▸ " + parentFolder(relativePath),
			arg: relativePath,
			quicklookurl: absolutePath,
			type: "file:skipcheck",
			uid: relativePath,
			icon: { path: iconpath },
			mods: {
				shift: { valid: hasLinks, subtitle: linksSubtitle },
			},
		});

		// Aliases
		if (file.aliases) {
			for (const alias of file.aliases) {
				const displayAlias = applyCensoring ? alias.replace(/./g, censorChar) : alias;
				resultsArr[insertVia]({
					title: emoji + superchargedIcon + displayAlias + superchargedIcon2,
					match: alfredMatcher(alias) + "alias",
					subtitle: "↪ " + displayName,
					arg: relativePath,
					quicklookurl: absolutePath,
					type: "file:skipcheck",
					uid: alias + "_" + relativePath,
					icon: { path: "icons/alias.png" },
					mods: {
						shift: { valid: hasLinks, subtitle: linksSubtitle },
					},
				});
			}
		}

		// Headings
		if (!file.headings) continue; // skips iteration if no heading
		for (const heading of file.headings) {
			const hName = heading.heading;
			const hLevel = heading.level;
			if (headingIgnore[hLevel]) continue; // skips iteration if heading has been configured as ignore
			const headingIconpath = `icons/headings/h${hLevel}.png`;
			const matchStr = [`h${hLevel}`, alfredMatcher(hName), alfredMatcher(filename)].join(" ");
			const displayHeading = applyCensoring ? hName.replace(/./g, censorChar) : hName;

			resultsArr[insertVia]({
				title: displayHeading,
				match: matchStr,
				subtitle: "➣ " + displayName,
				arg: relativePath + "#" + hName,
				uid: relativePath + "#" + hName,
				quicklookurl: absolutePath,
				icon: { path: headingIconpath },
				mods: {
					alt: { arg: relativePath },
					shift: {
						valid: hasLinks,
						subtitle: linksSubtitle,
						arg: relativePath,
					},
				},
			});
		}
	}

	// CANVASES
	for (const canvas of canvasArray) {
		const name = canvas.basename;
		const relativePath = canvas.relativePath;
		const denyForCanvas = { valid: false, subtitle: "⛔ Cannot do that with a canvas." };
		const isBookmarked = starsAndBookmarks.includes(relativePath);
		const isRecent = recentFiles.includes(relativePath);

		// matching for Alfred
		let additionalMatcher = "";
		if (isRecent) additionalMatcher += " recent";
		if (isBookmarked) additionalMatcher += " starred bookmarked";

		// pprioritization of sorting
		const prioritzedSorting = isRecent || isBookmarked;
		const insertMode = prioritzedSorting ? "unshift" : "push";

		resultsArr[insertMode]({
			title: name,
			match: alfredMatcher(name) + "canvas" + additionalMatcher,
			subtitle: "▸ " + parentFolder(relativePath),
			arg: relativePath,
			type: "file:skipcheck",
			icon: { path: "icons/canvas.png" },
			uid: relativePath,
			mods: {
				shift: denyForCanvas,
				fn: denyForCanvas,
			},
		});
	}

	// FOLDERS
	for (const absolutePath of folderArray) {
		const denyForFolder = { valid: false, subtitle: "⛔ Cannot do that with a folder." };
		const name = absolutePath.split("/").pop();
		const relativePath = absolutePath.slice(vaultPath.length + 1);
		if (!name) continue; // root on 2 level deep folder search

		resultsArr.push({
			title: name,
			match: alfredMatcher(name) + " folder ",
			subtitle: "▸ " + parentFolder(relativePath) + "   [↵: Browse]",
			arg: relativePath,
			type: "file:skipcheck",
			uid: relativePath,
			icon: { path: "icons/folder.png" },
			mods: {
				alt: { subtitle: "⌥: Open Folder in Finder" },
				cmd: denyForFolder,
				shift: denyForFolder,
				ctrl: denyForFolder,
				fn: denyForFolder,
			},
		});
	}

	// ADDITIONAL OPTIONS WHEN BROWSING A FOLDER
	if (isInSubfolder) {
		// New File in Folder
		resultsArr.push({
			title: "Create new note in this folder",
			subtitle: "▸ " + currentFolder,
			arg: "new",
			icon: { path: "icons/new.png" },
		});

		// go up to parent folder
		resultsArr.push({
			title: "⬆ Up to Parent Folder",
			match: "up back parent folder directory browse .. cd",
			subtitle: "▸ " + parentFolder(currentFolder),
			arg: parentFolder(currentFolder),
			icon: { path: "icons/folder.png" },
		});
	}
	if (resultsArr.length === 0) {
		resultsArr.push({
			title: "🚫 No notes found.",
			subtitle: "⛔ Possible causes: folder is empty or excluded in the Obsidian settings.",
			valid: false,
		});
	}

	return JSON.stringify({ items: resultsArr });
}
