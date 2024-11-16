#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} filePath */
function parentFolder(filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1).join("/");
}
const alfredMatcher = (/** @type {string} */ str) => str.replace(/[-()_.]/g, " ") + " " + str;
const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const mode = argv[0];
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");

	const metadataJSON = vaultPath + `/${configFolder}/plugins/metadata-extractor/metadata.json`;
	const starredJSON = vaultPath + `/${configFolder}/starred.json`;
	const bookmarkJSON = vaultPath + `/${configFolder}/bookmarks.json`;
	const subtitleType = $.getenv("main_search_subtitle");

	let recentJSON = vaultPath + `/${configFolder}/workspace.json`;
	if (!fileExists(recentJSON)) recentJSON = recentJSON.slice(0, -5); // Obsidian 1.0 uses workspace.json → https://discord.com/channels/686053708261228577/716028884885307432/1013906018578743478
	const recentFiles = fileExists(recentJSON) ? JSON.parse(readFile(recentJSON)).lastOpenFiles : [];

	if (!fileExists(metadataJSON)) {
		const errorItem = {
			title: "🚫 No vault metadata found.",
			subtitle: 'Please setup the "Metadata Extractor" as described in the README.',
			valid: false,
		};
		return JSON.stringify({ items: [errorItem] });
	}

	//──────────────────────────────────────────────────────────────────────────────
	// BOOKMARKS & STARS
	let stars = [];
	const bookmarks = [];
	if (fileExists(starredJSON)) {
		stars = JSON.parse(readFile(starredJSON))
			.items.filter((/** @type {{ type: string; }} */ item) => item.type === "file")
			.map((/** @type {{ path: string; }} */ item) => item.path);
	}

	/** @param {any[]} input @param {any[]} collector */
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

	// filter the metadataJSON for the items:
	// relativePaths of recent files OR bookmarks
	const fileArray = JSON.parse(readFile(metadataJSON))
		.filter((/** @type {{ relativePath: string; }} */ item) => {
			if (mode === "recents") return recentFiles.includes(item.relativePath);
			if (mode === "bookmarks") return starsAndBookmarks.includes(item.relativePath);
		})
		.map((file) => {
			const filename = file.fileName;
			const relativePath = file.relativePath;

			// icon & type dependent actions
			let iconpath = "icons/note.png";
			let emoji = "";
			let additionalMatcher = "";
			// append only indicators for the other mode, since the recent file
			// icons for recent file search and bookmark icons for bookmark
			// search are obvious
			if (mode === "recents" && starsAndBookmarks.includes(relativePath)) {
				emoji += "🔖 ";
				additionalMatcher += "starred bookmark ";
			} else if (mode === "bookmarks" && recentFiles.includes(relativePath)) {
				emoji += "🕑 ";
				additionalMatcher += "recent ";
			}
			if ($.getenv("remove_emojis") === "1") emoji = "";
			if (filename.toLowerCase().includes("kanban")) iconpath = "icons/kanban.png";

			const subtitle =
				subtitleType === "parent"
					? "▸ " + parentFolder(relativePath)
					: (file.tags || []).map((/** @type {string} */ t) => "#" + t).join(" ");

			// push result
			return {
				title: emoji + filename,
				match: additionalMatcher + alfredMatcher(filename),
				subtitle: subtitle,
				arg: relativePath,
				quicklookurl: vaultPath + "/" + relativePath,
				type: "file:skipcheck",
				uid: relativePath,
				icon: { path: iconpath },
			};
		});

	return JSON.stringify({
		items: fileArray,
		cache: { seconds: 300, loosereload: true },
	});
}
