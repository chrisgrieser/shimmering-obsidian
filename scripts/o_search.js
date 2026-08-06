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
function camelCaseMatch(str) {
	const subwords = str.replace(/[-_./]/g, " ");
	const fullword = str.replace(/[-_./]/g, "");
	const camelCaseSeparated = str.replace(/([A-Z])/g, " $1");
	return [subwords, camelCaseSeparated, fullword, str].join(" ") + " ";
}

const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

//──────────────────────────────────────────────────────────────────────────────
/**
 * Gets the paths of all vaults configured in Obsidian by reading the obsidian.json file.
 *
 * @returns {string[]} An array of vault paths.
 */
function getVaultPaths() {
	const vaultListJson =
		app.pathTo("home folder") + "/Library/Application Support/obsidian/obsidian.json";
	if (!fileExists(vaultListJson)) return [];
	const vaultList = JSON.parse(readFile(vaultListJson)).vaults;
	const vaultPaths = [];
	for (const hash in vaultList) {
		vaultPaths.push(vaultList[hash].path);
	}
	return vaultPaths;
}

function getVaultData(vaultPath, configFolder) {
	const vaultConfig = `${vaultPath}/${configFolder}`;
	if (!fileExists(vaultConfig)) return null;

	const metadataJSON = `${vaultConfig}/plugins/metadata-extractor/metadata.json`;
	const canvasJSON = `${vaultConfig}/plugins/metadata-extractor/canvas.json`;
	const starredJSON = `${vaultConfig}/starred.json`;
	const bookmarkJSON = `${vaultConfig}/bookmarks.json`;
	const excludeFilterJSON = `${vaultConfig}/app.json`;

	let recentJSON = `${vaultConfig}/workspace.json`;
	if (!fileExists(recentJSON)) recentJSON = recentJSON.slice(0, -5); // Obsidian 0.16 uses workspace.json → https://discord.com/channels/686053708261228577/716028884885307432/1013906018578743478

	const excludeFilter = fileExists(excludeFilterJSON)
		? JSON.parse(readFile(excludeFilterJSON)).userIgnoreFilters
		: [];
	const recentFiles = fileExists(recentJSON) ? JSON.parse(readFile(recentJSON)).lastOpenFiles : [];
	const canvasArray = fileExists(canvasJSON) ? JSON.parse(readFile(canvasJSON)) : [];

	//───────────────────────────────────────────────────────────────────────────
	// Main Metadata
	if (!fileExists(metadataJSON)) {
		const errorItem = {
			title: "🚫 No vault metadata found.",
			subtitle: 'Please setup the "Metadata Extractor" as described in the README.',
			valid: false,
		};
		return JSON.stringify({ items: [errorItem] });
	}
	const fileArray = JSON.parse(readFile(metadataJSON));

	//──────────────────────────────────────────────────────────────────────────────
	// BOOKMARKS & STARS

	/** @typedef {Object} Bookmark
	 * @property {string} type
	 * @property {string} path
	 * @property {Bookmark[]} items
	 */

	/** @type {string[]} */ let stars = [];
	/** @type {string[]} */ const bookmarks = [];
	if (fileExists(starredJSON)) {
		stars = JSON.parse(readFile(starredJSON))
			.items.filter((/** @type {{ type: string; }} */ item) => item.type === "file")
			.map((/** @type {{ path: string; }} */ item) => item.path);
	}

	/** @param {Bookmark[]} input @param {string[]} collector */
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
	const vaultName = vaultPath.split("/").pop();

	return {
		vaultPath,
		vaultName,
		fileArray,
		canvasArray,
		starsAndBookmarks,
		recentFiles,
		excludeFilter,
	};
}

/**
 * @param {any} file
 * @param {string} vaultPath
 * @param {string[]} starsAndBookmarks
 * @param {string[]} recentFiles
 * @param {boolean} removeEmojis
 * @param {string} subtitleType
 * @param {boolean[]} headingIgnore
 * @returns {AlfredItem[]}
 */
function createFileItems(
	file,
	vaultPath,
	starsAndBookmarks,
	recentFiles,
	removeEmojis,
	subtitleType,
	headingIgnore,
) {
	const items = [];
	const filename = file.fileName;
	const relativePath = file.relativePath;
	const absolutePath = vaultPath + "/" + relativePath;
	const isBookmarked = starsAndBookmarks.includes(relativePath);
	const isRecent = recentFiles.includes(relativePath);
	const isPrioritized = isRecent || isBookmarked;

	// matching for Alfred
	const tagMatcher = file.tags ? " #" + file.tags.join(" #") : "";
	let additionalMatcher = "";
	if (isRecent) additionalMatcher += " recent";
	if (isBookmarked) additionalMatcher += " starred bookmarked";

	// icon & emojis
	let iconpath = "icons/note.png";
	let emoji = "";
	if (isBookmarked) emoji += "🔖 ";
	if (isRecent) emoji += "🕑 ";
	if (filename.toLowerCase().includes("kanban")) iconpath = "icons/kanban.png";
	if (removeEmojis) emoji = "";

	const subtitle =
		subtitleType === "parent"
			? "▸ " + parentFolder(relativePath)
			: (file.tags || []).map((/** @type {string} */ t) => "#" + t).join(" ");

	// Notes (file names)
	items.push({
		title: emoji + filename,
		match: camelCaseMatch(filename) + tagMatcher + " filename name title" + additionalMatcher,
		subtitle: subtitle,
		arg: relativePath,
		quicklookurl: absolutePath,
		type: "file:skipcheck",
		uid: relativePath,
		icon: { path: iconpath },
		variables: { note_vault_path: vaultPath },
		isPrioritized: isPrioritized,
	});

	// Aliases
	if (file.aliases) {
		for (const alias of file.aliases) {
			items.push({
				title: emoji + alias,
				match: camelCaseMatch(alias) + "alias",
				subtitle: "↪ " + alias,
				arg: relativePath,
				quicklookurl: absolutePath,
				type: "file:skipcheck",
				uid: alias + "_" + relativePath,
				icon: { path: "icons/alias.png" },
				variables: { note_vault_path: vaultPath },
				isPrioritized: isPrioritized,
			});
		}
	}

	// Headings
	if (file.headings) {
		for (const heading of file.headings) {
			const hName = heading.heading;
			const hLevel = heading.level;
			if (headingIgnore[hLevel]) continue; // skips iteration if heading has been configured as ignore
			const headingIconpath = `icons/headings/h${hLevel}.png`;
			const matchStr = camelCaseMatch(hName) + `h${hLevel}`;

			items.push({
				title: hName,
				match: matchStr,
				subtitle: "➣ " + filename,
				arg: relativePath + "#" + hName,
				uid: relativePath + "#" + hName,
				quicklookurl: absolutePath,
				icon: { path: headingIconpath },
				mods: {
					alt: { arg: relativePath },
					shift: { arg: relativePath },
				},
				variables: { note_vault_path: vaultPath },
				isPrioritized: isPrioritized,
			});
		}
	}

	return items;
}

/**
 * @param {any} canvas
 * @param {string[]} starsAndBookmarks
 * @param {string[]} recentFiles
 * @returns {AlfredItem}
 */
function createCanvasItem(canvas, starsAndBookmarks, recentFiles) {
	const name = canvas.basename;
	const relativePath = canvas.relativePath;
	const isBookmarked = starsAndBookmarks.includes(relativePath);
	const isRecent = recentFiles.includes(relativePath);

	// matching for Alfred
	let additionalMatcher = "";
	if (isRecent) additionalMatcher += " recent";
	if (isBookmarked) additionalMatcher += " starred bookmarked";

	return {
		title: name,
		match: camelCaseMatch(name) + "canvas" + additionalMatcher,
		subtitle: "▸ " + parentFolder(relativePath),
		arg: relativePath,
		type: "file:skipcheck",
		icon: { path: "icons/canvas.png" },
		uid: relativePath,
		variables: { note_vault_path: vaultPath },
		mods: {
			shift: { valid: false, subtitle: "⛔ Cannot do that with a canvas." },
			fn: { valid: false, subtitle: "⛔ Cannot do that with a canvas." },
		},
		isPrioritized: isRecent || isBookmarked,
	};
}

/**
 * @param {string} absolutePath
 * @param {string} vaultPath
 * @returns {AlfredItem | null}
 */
function createFolderItem(absolutePath, vaultPath) {
	const name = absolutePath.split("/").pop();
	const relativePath = absolutePath.slice(vaultPath.length + 1);
	if (!name) return null; // root on 2 level deep folder search

	const denyForFolder = { valid: false, subtitle: "⛔ Cannot do that with a folder." };
	return {
		title: name,
		match: camelCaseMatch(name) + "folder",
		subtitle: "▸ " + parentFolder(relativePath) + "   [↵: Browse]",
		arg: relativePath,
		type: "file:skipcheck",
		uid: relativePath,
		icon: { path: "icons/folder.png" },
		variables: {
			folder_vault_path: vaultPath,
		},
		mods: {
			alt: { subtitle: "⌥: Open Folder in Finder" },
			cmd: denyForFolder,
			shift: denyForFolder,
			ctrl: denyForFolder,
			fn: denyForFolder,
		},
	};
}

/**
 * Environment variables:
 *
 * - vault_path: workflow's active vault path.
 * - config_folder: The Obsidian configuration folder (e.g., ".obsidian").
 * - main_search_subtitle: The type of subtitle to display ("parent" or "tags").
 * - remove_emojis: Set to "1" to remove emojis from search results.
 * - browse_folder: (optional) The path of a subfolder to search within.
 *   Can be undefined, "/", or a relative path signifying the subfolder mode.
 * - current_vault_path: (optional) The vault path for the subfolder mode.
 *   Must be set for for the subfolder mode.
 * - h_lvl_ignore: Heading levels to ignore (e.g., "123").
 * - search_all_vaults: (optional) Set to "1" to search all vaults instead of just the active one.
 *
 * @type {AlfredRun}
 */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const configFolder = $.getenv("config_folder");
	const removeEmojis = $.getenv("remove_emojis") === "1";
	const subtitleType = $.getenv("main_search_subtitle");
	const searchAllVaults =
		$.NSProcessInfo.processInfo.environment.objectForKey("search_all_vaults").js === "1";

	let vaultsToSearch = [$.getenv("vault_path")];
	if (searchAllVaults) {
		vaultsToSearch = getVaultPaths();
	}

	// ignored headings
	const hLVLignore = $.getenv("h_lvl_ignore");
	const headingIgnore = [];
	for (let i = 1; i < 7; i++) {
		const shouldIgnore = hLVLignore.includes(i.toString());
		headingIgnore[i] = shouldIgnore;
	}

	/** @type {AlfredItem[]} */
	const resultsArr = [];

	let currentFolder = "";
	let isInSubfolder = false;
	// either searches the vault, or a subfolder of the vault
	try {
		const currentFolderVaultPath =
			$.NSProcessInfo.processInfo.environment.objectForKey("current_vault_path").js;
		currentFolder = $.NSProcessInfo.processInfo.environment.objectForKey("browse_folder").js;
		if (currentFolder !== "/" && currentFolder !== undefined) {
			isInSubfolder = true;
			// When browsing a folder, we only search in that specific vault and folder
			vaultsToSearch = [currentFolderVaultPath];
		}
	} catch (_error) {
		// ignore
	}

	for (const vaultPath of vaultsToSearch) {
		const vaultConfig = `${vaultPath}/${configFolder}`;

		if (!fileExists(vaultConfig)) {
			// Skip vaults that don't have the config folder instead of erroring out when searching all vaults
			if (!searchAllVaults) {
				const errorItem = {
					title: `🚫 Vault config folder "${configFolder}" not found.`,
					subtitle: "Set the correct config folder in the workflow configuration.",
					valid: false,
				};
				return JSON.stringify({ items: [errorItem] });
			}
			continue;
		}

		const vaultData = getVaultData(vaultPath, configFolder);
		if (!vaultData || typeof vaultData === "string") {
			if (!searchAllVaults && typeof vaultData === "string") return vaultData;
			continue;
		}
		let { fileArray, canvasArray, starsAndBookmarks, recentFiles, excludeFilter, vaultName } =
			vaultData;

		//──────────────────────────────────────────────────────────────────────────────
		// DETERMINE PATH TO SEARCH
		let pathToSearch = vaultPath;
		if (isInSubfolder) {
			pathToSearch = vaultPath + "/" + currentFolder;
		}

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
		 * @param {(string|{relativePath: string})[]} items if folder, object list otherwise
		 * @param {boolean} isFolder
		 * @return {(string|{relativePath: string})[]}
		 */
		function applyExcludeFilter(items, isFolder) {
			if (!excludeFilter || excludeFilter.length === 0 || items.length === 0) return items;
			return items.filter((item) => {
				let include = true;
				// @ts-expect-error
				const path = isFolder ? item + "/" : item.relativePath;
				for (const filter of excludeFilter) {
					const isRegexFilter = filter.startsWith("/");
					const relPath = isFolder ? path.slice(vaultPath.length + 1) : path;
					if (isRegexFilter && relPath.includes(filter)) include = false;
					if (!isRegexFilter && relPath.startsWith(filter)) include = false;
				}
				return include;
			});
		}

		folderArray = applyExcludeFilter(folderArray, true);
		canvasArray = applyExcludeFilter(canvasArray, false);
		fileArray = applyExcludeFilter(fileArray, false);

		//──────────────────────────────────────────────────────────────────────────────
		// CONSTRUCTION OF JSON FOR ALFRED

		// FILES
		for (const file of fileArray) {
			const fileItems = createFileItems(
				file,
				vaultPath,
				starsAndBookmarks,
				recentFiles,
				removeEmojis,
				subtitleType,
				headingIgnore,
			);
			for (const item of fileItems) {
				const isPrioritized = item.isPrioritized;
				delete item.isPrioritized;
				if (searchAllVaults) {
					item.subtitle = `[${vaultName}] ` + item.subtitle;
				}
				resultsArr[isPrioritized ? "unshift" : "push"](item);
			}
		}

		// CANVASES
		for (const canvas of canvasArray) {
			const canvasItem = createCanvasItem(canvas, starsAndBookmarks, recentFiles);
			const isPrioritized = canvasItem.isPrioritized;
			delete canvasItem.isPrioritized;
			if (searchAllVaults) {
				canvasItem.subtitle = `[${vaultName}] ` + canvasItem.subtitle;
			}
			resultsArr[isPrioritized ? "unshift" : "push"](canvasItem);
		}

		// FOLDERS
		for (const absolutePath of folderArray) {
			const folderItem = createFolderItem(absolutePath, vaultPath);
			if (folderItem) {
				if (searchAllVaults) {
					folderItem.subtitle = `[${vaultName}] ` + folderItem.subtitle;
				}
				resultsArr.push(folderItem);
			}
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
				variables: {
					folder_vault_path: vaultPath,
				},
			});
		}
	}

	if (resultsArr.length === 0) {
		resultsArr.push({
			title: "🚫 No notes found.",
			subtitle: "⛔ Possible causes: folder is empty or excluded in the Obsidian settings.",
			valid: false,
		});
	}

	// INFO not using Alfred's caching mechanism, as it breaks browsing folders
	// see https://github.com/chrisgrieser/shimmering-obsidian/issues/176
	return JSON.stringify({ items: resultsArr });
}
