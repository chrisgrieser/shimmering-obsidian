#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function alfredMatcher(str) {
	if (!str) return "";
	const clean = str.replace(/[-()_.:#/\\;,[\]]/g, " ");
	const camelCaseSeperated = str.replace(/([A-Z])/g, " $1");
	return [clean, camelCaseSeperated, str].join(" ") + " ";
}

function onlineJSON(url) {
	return JSON.parse(app.doShellScript("curl -s \"" + url + "\""));
}
function insert1000sep(num) {
	let numText = String(num);
	if (num >= 10000) {
		numText =
			numText.slice(0, -3) +
			"." +
			numText.slice(-3);
	}
	return numText;
}

function readFile(path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

function SafeApplication(appId) {
	try {
		return Application(appId);
	} catch (error) {
		return null;
	}
}
const discordReadyLinks = ["Discord", "Discord PTB", "Discord Canary"]
	.some(discordApp => SafeApplication(discordApp)?.frontmost());

function getVaultPath() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
}
const vaultPath = getVaultPath()

function getVaultNameEncoded() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const theVaultPath = ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
	return encodeURIComponent(theVaultPath.replace(/.*\//, ""));
}
const vaultNameEnc = getVaultNameEncoded();
const jsonArray = [];

//------------------------------------------------------------------------------

const pluginJSON = onlineJSON("https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json");
const downloadsJSON = onlineJSON("https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json");
const installedPlugins = app.doShellScript("ls -1 \"" + vaultPath + "\"\"/.obsidian/plugins/\"")
	.split("\r");

const themeJSON = onlineJSON("https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-css-themes.json");
const installedThemes = app.doShellScript("find '" + vaultPath + "/.obsidian/themes/' -name '*.css' ");
const currentTheme = app.doShellScript("cat \"" + vaultPath + "/.obsidian/appearance.json\" | grep \"cssTheme\" | head -n 1 | cut -d\\\" -f 4"); // eslint-disable-line no-useless-escape

const deprecatedJSON = JSON.parse(readFile("./data/deprecated-plugins.json"));
const deprecatedPlugins = [
	...deprecatedJSON.sherlocked,
	...deprecatedJSON.dysfunct,
	...deprecatedJSON.deprecated,
];

//------------------------------------------------------------------------------


// add PLUGINS to the JSON
pluginJSON.forEach(plugin => {
	const id = plugin.id;
	const name = plugin.name;
	const description = plugin.description
		.replaceAll("\\\"", "'") // to deal with escaped '"' in descriptions
		.replace(/\. *$/, ""); // trailing dot in description looks weird with the styling done here later in the item subtitle
	const author = plugin.author;
	const repo = plugin.repo;

	const githubURL = "https://github.com/" + repo;
	const openURI = `obsidian://show-plugin?vault=${vaultNameEnc}&id=${id}`;
	let isDiscordReady, shareURL;
	if (discordReadyLinks) {
		shareURL = `> **${name}**: ${description} <https://obsidian.md/plugins?id=${id}>`;
		isDiscordReady = " (discord ready)";
	} else {
		shareURL = "https://obsidian.md/plugins?id=" + id;
		isDiscordReady = "";
	}

	// Download Numbers
	let downloadsStr = "";
	if (downloadsJSON[id]) {
		const downloads = downloadsJSON[id].downloads;
		downloadsStr = "  ↓ " + insert1000sep(downloads);
	}

	// check whether already installed / deprecated
	let icons = "";
	let subtitleIcons = "";
	if (installedPlugins.includes(id)) icons += " ✅";
	if (deprecatedPlugins.includes(id)) {
		icons += " ⚠️";
		subtitleIcons = "deprecated – ";
	}

	// Better matching for some plugins
	const URImatcher = name.includes("URI") ? "URL" : "";

	// create json for Alfred
	jsonArray.push({
		"title": name + icons,
		"subtitle": subtitleIcons + description + " — by " + author + downloadsStr,
		"arg": openURI,
		"uid": id,
		"match": `plugin ${URImatcher} ${alfredMatcher(name)} ${alfredMatcher(author)} ${alfredMatcher(id)} ${alfredMatcher(description)}`,
		"mods": {
			"cmd": { "arg": githubURL },
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy Link" + isDiscordReady,
			},
			"shift": { "arg": `${repo};${id};${name}` },
			"ctrl": {
				"arg": id,
				"subtitle": `by ${author}   ${downloadsStr}       ID: ${id} (⌃: Copy ID)`,
			},
		},
	});
});

// add THEMES to the JSON
themeJSON.forEach(theme => {
	const name = theme.name;
	const author = theme.author;
	const repo = theme.repo;
	const branch = theme.branch ? theme.branch : "master";

	// const githubURL = "https://github.com/" + repo;
	const rawGitHub = "https://raw.githubusercontent.com/" + repo + "/" + branch + "/";
	const screenshotURL = rawGitHub + theme.screenshot;

	const githubURL = "https://github.com/" + repo;
	const nameEncoded = encodeURIComponent(name);
	const openURI = `obsidian://show-theme?vault=${vaultNameEnc}&name=${nameEncoded}`;
	let shareURL = `obsidian://show-theme?name=${nameEncoded}`;
	let isDiscordReady = "";
	if (discordReadyLinks) {
		shareURL = `> **${name}**: <${shareURL}>`;
		isDiscordReady = " (discord ready)";
	}

	let modes = "";
	let installedIcon = "";
	if (theme.modes) {
		if (theme.modes.includes("light")) modes += "☀️ ";
		if (theme.modes.includes("dark")) modes += "🌒 ";
	}
	if (installedThemes.includes(name)) installedIcon = " ✅";
	if (currentTheme === name) installedIcon = " ⭐️";

	// create json for Alfred
	jsonArray.push({
		"title": name + installedIcon,
		"subtitle": modes + "  by " + author,
		"match": `theme ${alfredMatcher(author)} ${alfredMatcher(name)}`,
		"arg": openURI,
		"uid": repo,
		"quicklookurl": screenshotURL,
		"icon": { "path": "icons/css.png" },
		"mods": {
			"shift": { "arg": repo },
			"cmd": { "arg": githubURL },
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy Obsidian URI form Theme" + isDiscordReady,
			},
			"ctrl": {
				"valid": false,
				"subtitle": "⛔️ Theme Download numbers not supported yet.",
			},
		},
	});
});

JSON.stringify({ items: jsonArray });
