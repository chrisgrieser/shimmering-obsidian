#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} str */
function alfredMatcher(str) {
	if (!str) return "";
	const clean = str.replace(/[-()_.:#/\\;,[\]]/g, " ");
	const camelCaseSeparated = str.replace(/([A-Z])/g, " $1");
	return [clean, camelCaseSeparated, str].join(" ") + " ";
}

/** @param {string} url */
function onlineJSON(url) {
	return JSON.parse(app.doShellScript(`curl -sL "${url}"`));
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

/** @param {string} appId */
function SafeApplication(appId) {
	try {
		return Application(appId);
	} catch {
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
	const vaultNameEnc = encodeURIComponent(vaultPath.replace(/.*\//, ""));

	const pluginJSON = onlineJSON(
		"https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json",
	);
	const downloadsJSON = onlineJSON(
		"https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json",
	);
	const installedPlugins = app
		// checking for `main.js` instead of folders, to ensure that empty
		// leftover folders are not picked up as installed plugins
		.doShellScript(`find "${vaultPath}/${configFolder}/plugins" -name "main.js"`)
		.split("\r")
		.map((f) => f.replace(/.*\/(.*)\/main\.js/, "$1")); // path to plugin-id (= folder name)

	const themeJSON = onlineJSON(
		"https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-css-themes.json",
	);
	const installedThemes = app.doShellScript(
		`find '${vaultPath}/${configFolder}/themes/' -name '*.css' || true`,
	);
	const currentTheme = JSON.parse(
		readFile(`${vaultPath}/${configFolder}/appearance.json`),
	)?.cssTheme;

	const depre = JSON.parse(readFile("./data/deprecated-plugins.json"));
	const deprecatedPlugins = [...depre.sherlocked, ...depre.dysfunct, ...depre.deprecated];

	//───────────────────────────────────────────────────────────────────────────

	// add PLUGINS to the JSON
	const plugins = pluginJSON.map(
		(
			/** @type {{ id: string; name: string; description: string; author: string; repo: string; }} */ plugin,
		) => {
			let { id, name, description, author, repo } = plugin;
			description = plugin.description
				.replaceAll('\\"', "'") // to deal with escaped '"' in descriptions
				.replace(/\. *$/, ""); // trailing dot in description looks weird with the styling done here later in the item subtitle

			const githubURL = "https://github.com/" + repo;
			const openURI = `obsidian://show-plugin?vault=${vaultNameEnc}&id=${id}`;
			// Discord accepts simple markdown, the enclosing, the enclosing `<>`
			// remove the preview
			const discordUrl = `> [${name}](<https://obsidian.md/plugins?id=${id}>): ${description}`;

			const isDiscordReady = discordReadyLinks ? " (discord ready)" : "";
			const shareURL = isDiscordReady ? discordUrl : `https://obsidian.md/plugins?id=${id}`;

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
			const uriMatcher = name.includes("URI") ? "URL" : "";
			// biome-ignore format: less readable
			const matcher = `plugin ${uriMatcher} ${alfredMatcher(name)} ${alfredMatcher(author)} ${alfredMatcher(id)} ${alfredMatcher(description)}`;
			const subtitle = downloadsStr + subtitleIcons + description + "  ·  by " + author;

			// needs lowercasing https://github.com/chrisgrieser/shimmering-obsidian/commit/9642fc3d36f9b59cedadbd24991dd4b65078132f#r139057296
			const obsiStatsUrl =
				"https://www.moritzjung.dev/obsidian-stats/plugins/" + plugin.id.toLowerCase();

			// create json for Alfred
			/** @type {AlfredItem} */
			const alfredItem = {
				title: name + icons,
				subtitle: subtitle,
				arg: githubURL,
				uid: id,
				match: matcher,
				mods: {
					fn: { arg: obsiStatsUrl },
					cmd: { arg: openURI },
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
			/** @type {{ name: string; author: string; repo: string; branch: string; screenshot: string; modes: string | string[]; }} */ theme,
		) => {
			let { name, author, repo, branch, screenshot } = theme;
			const id = repo.split("/")[1];
			branch = branch || "master";

			const rawGitHub = `https://raw.githubusercontent.com/${repo}/${branch}/`;
			const screenshotURL = rawGitHub + screenshot;
			const githubURL = "https://github.com/" + repo;
			const nameEncoded = encodeURIComponent(name);
			const openURI = `obsidian://show-theme?vault=${vaultNameEnc}&name=${nameEncoded}`;
			const discordUrl = `> **${name}**: <${openURI}>`;

			const isDiscordReady = discordReadyLinks ? " (discord ready)" : "";
			const shareURL = isDiscordReady ? discordUrl : `obsidian://show-theme?name=${nameEncoded}`;

			let modes = "";
			let installedIcon = "";
			if (theme.modes?.includes("light")) modes += "☀️ ";
			if (theme.modes?.includes("dark")) modes += "🌒 ";
			if (currentTheme === name) installedIcon = " ⭐️";
			else if (installedThemes.includes(name)) installedIcon = " ✅";

			// needs lowercasing https://github.com/chrisgrieser/shimmering-obsidian/commit/9642fc3d36f9b59cedadbd24991dd4b65078132f#r139057296
			const obsiStatsUrl = "https://www.moritzjung.dev/obsidian-stats/themes/" + id.toLowerCase();

			/** @type {AlfredItem} */
			return {
				title: name + installedIcon,
				subtitle: `${modes}  by ${author}`,
				match: `theme ${alfredMatcher(author)} ${alfredMatcher(name)}`,
				arg: githubURL,
				uid: repo,
				quicklookurl: screenshotURL,
				icon: { path: "icons/css.png" },
				mods: {
					ctrl: { valid: false },
					cmd: { arg: openURI },
					shift: { arg: repo },
					fn: { arg: obsiStatsUrl },
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

	return JSON.stringify({
		items: [...plugins, ...themes],
		cache: {
			seconds: 3600 * 3, // 3 hours, bit quicker to catch new plugin admissions
			loosereload: true,
		},
	});
}
