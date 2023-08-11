#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

//──────────────────────────────────────────────────────────────────────────────

/** @param {string} str */
function alfredMatcher(str) {
	if (!str) return "";
	const clean = str.replace(/[-()_.:#/\\;,[\]]/g, " ");
	const camelCaseSeperated = str.replace(/([A-Z])/g, " $1");
	return [clean, camelCaseSeperated, str].join(" ") + " ";
}

/** @param {string} url */
function onlineJSON(url) {
	return JSON.parse(app.doShellScript('curl -s "' + url + '"'));
}

/** @param {number} num */
function insert1000sep(num) {
	let numStr = num.toString();
	let acc = "";
	while (numStr.length > 3) {
		acc = "." + numStr.slice(-3) + acc;
		numStr = numStr.slice(0, -3);
	}
	return numStr + acc;
}

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

/** @param {string} filepath @param {string} text */
function writeToFile(filepath, text) {
	const str = $.NSString.alloc.initWithUTF8String(text);
	str.writeToFileAtomicallyEncodingError(filepath, true, $.NSUTF8StringEncoding, null);
}

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

function ensureCacheFolderExists() {
	const finder = Application("Finder");
	const cacheDir = $.getenv("alfred_workflow_cache");
	if (!finder.exists(Path(cacheDir))) {
		console.log("Cache Dir does not exist and is created.");
		const cacheDirBasename = $.getenv("alfred_workflow_bundleid");
		const cacheDirParent = cacheDir.slice(0, -cacheDirBasename.length);
		finder.make({
			new: "folder",
			at: Path(cacheDirParent),
			withProperties: { name: cacheDirBasename },
		});
	}
}

/** @param {string} path */
function cacheIsOutdated(path) {
	const cacheAgeThresholdHours = 24;
	ensureCacheFolderExists();
	const cacheObj = Application("System Events").aliases[path];
	if (!cacheObj.exists()) return true;
	const cacheAgeMins = (+new Date() - cacheObj.creationDate()) / 1000 / 60 / 60;
	return cacheAgeMins > cacheAgeThresholdHours;
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	// PERF cache results
	const cachePath = $.getenv("alfred_workflow_cache") + "/plugin-cache.json";
	if (!cacheIsOutdated(cachePath)) return readFile(cachePath);

	//───────────────────────────────────────────────────────────────────────────

	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");
	const vaultNameEnc = encodeURIComponent(vaultPath.replace(/.*\//, ""));

	const pluginJSON = onlineJSON(
		"https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json",
	);
	const downloadsJSON = onlineJSON(
		"https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json",
	);
	const installedPlugins = app.doShellScript(`ls -1 "${vaultPath}/${configFolder}/plugins/"`).split("\r");

	const themeJSON = onlineJSON(
		"https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-css-themes.json",
	);
	const installedThemes = app.doShellScript(
		`find '${vaultPath}/${configFolder}/themes/' -name '*.css' || true`,
	);
	const currentTheme = app.doShellScript(
		`grep "cssTheme" "${vaultPath}/${configFolder}/appearance.json" | head -n1 | cut -d'"' -f4 || true`,
	);

	const deprecated = JSON.parse(readFile("./data/deprecated-plugins.json"));
	const deprecatedPlugins = [...deprecated.sherlocked, ...deprecated.dysfunct, ...deprecated.deprecated];

	//───────────────────────────────────────────────────────────────────────────

	// add PLUGINS to the JSON
	const plugins = pluginJSON.map(
		(/** @type {{ id: any; name: any; description: string; author: any; repo: any; }} */ plugin) => {
			const id = plugin.id;
			const name = plugin.name;
			const description = plugin.description
				.replaceAll('\\"', "'") // to deal with escaped '"' in descriptions
				.replace(/\. *$/, ""); // trailing dot in description looks weird with the styling done here later in the item subtitle
			const author = plugin.author;
			const repo = plugin.repo;

			const githubURL = "https://github.com/" + repo;
			const openURI = `obsidian://show-plugin?vault=${vaultNameEnc}&id=${id}`;
			const discordUrl = `> **${name}**: ${description} <https://obsidian.md/plugins?id=${id}>`;
			let isDiscordReady, shareURL;
			if (discordReadyLinks) {
				shareURL = discordUrl;
				isDiscordReady = " (discord ready)";
			} else {
				shareURL = "https://obsidian.md/plugins?id=" + id;
				isDiscordReady = "";
			}

			// Download Numbers
			let downloadsStr = "";
			if (downloadsJSON[id]) {
				const downloads = downloadsJSON[id].downloads;
				downloadsStr = insert1000sep(downloads) + "↓  ·  ";
			}

			// check whether already installed / deprecated
			let icons = "";
			let subtitleIcons = "";
			if (installedPlugins.includes(id)) icons += " ✅";
			if (deprecatedPlugins.includes(id)) {
				icons += " ⚠️";
				subtitleIcons = "deprecated · ";
			}

			// Better matching for some plugins
			const URImatcher = name.includes("URI") ? "URL" : "";
			const matcher = `plugin ${URImatcher} ${alfredMatcher(name)} ${alfredMatcher(author)} ${alfredMatcher(
				id,
			)} ${alfredMatcher(description)}`;
			const subtitle = downloadsStr + subtitleIcons + description + "  ·  by " + author;

			// create json for Alfred
			/** @type {AlfredItem} */
			const alfredItem = {
				title: name + icons,
				subtitle: subtitle,
				arg: openURI,
				uid: id,
				match: matcher,
				mods: {
					cmd: { arg: githubURL },
					ctrl: { arg: id },
					"cmd+alt": {
						arg: discordUrl,
						subtitle: "⌘⌥: Copy Link (discord ready)",
					},
					shift: { arg: repo },
					alt: {
						arg: shareURL,
						subtitle: "⌥: Copy Link" + isDiscordReady,
					},
				},
			};
			return alfredItem;
		},
	);

	// add THEMES to the JSON
	const themes = themeJSON.map(
		(
			/** @type {{ name: any; author: any; repo: any; branch: any; screenshot: string; modes: string | string[]; }} */ theme,
		) => {
			const name = theme.name;
			const author = theme.author;
			const repo = theme.repo;
			const branch = theme.branch ? theme.branch : "master";

			const rawGitHub = `https://raw.githubusercontent.com/${repo}/${branch}/`;
			const screenshotURL = rawGitHub + theme.screenshot;
			const githubURL = "https://github.com/" + repo;
			const nameEncoded = encodeURIComponent(name);
			const openURI = `obsidian://show-theme?vault=${vaultNameEnc}&name=${nameEncoded}`;
			const discordUrl = `> **${name}**: <${openURI}>`;

			let isDiscordReady, shareURL;
			if (discordReadyLinks) {
				shareURL = discordUrl;
				isDiscordReady = " (discord ready)";
			} else {
				shareURL = `obsidian://show-theme?name=${nameEncoded}`;
				isDiscordReady = "";
			}

			let modes = "";
			let installedIcon = "";
			if (theme.modes?.includes("light")) modes += "☀️ ";
			if (theme.modes?.includes("dark")) modes += "🌒 ";
			if (currentTheme === name) installedIcon = " ⭐️";
			else if (installedThemes.includes(name)) installedIcon = " ✅";

			// create json for Alfred
			/** @type {AlfredItem} */
			return {
				title: name + installedIcon,
				subtitle: `${modes}  by ${author}`,
				match: `theme ${alfredMatcher(author)} ${alfredMatcher(name)}`,
				arg: openURI,
				uid: repo,
				quicklookurl: screenshotURL,
				icon: { path: "icons/css.png" },
				mods: {
					ctrl: { valid: false },
					cmd: { arg: githubURL },
					shift: { arg: repo },
					"cmd+alt": {
						arg: discordUrl,
						subtitle: "⌘⌥: Copy Link (discord ready)",
					},
					alt: {
						arg: shareURL,
						subtitle: "⌥: Copy Obsidian URI for Theme" + isDiscordReady,
					},
				},
			};
		},
	);

	const alfredResponse = JSON.stringify({ items: [...plugins, ...themes] });
	writeToFile(cachePath, alfredResponse);

	return alfredResponse;
}
