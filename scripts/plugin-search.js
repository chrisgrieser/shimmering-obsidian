#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function alfredMatcher (str) {
	return " " + str.replace (/[-()_.@]/g, " ") + " " + str + " ";
}
function onlineJSON (url) {
	return JSON.parse (app.doShellScript("curl -s \"" + url + "\""));
}
function insert1000sep (num) {
	let numText = String(num);
	if (num >= 10000) {numText =
		numText.slice(0, -3) +
		"." +
		numText.slice (-3);}
	return numText;
}

function readFile (path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

function SafeApplication(appId) {
	try {
		return Application(appId);
	} catch (e) {
		return null;
	}
}
const discordReadyLinks = ["Discord", "Discord PTB", "Discord Canary"]
	.some(discordApp => SafeApplication(discordApp)?.frontmost());

const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const vaultNameENC = $.getenv("vault_name_ENC").replace(/^~/, app.pathTo("home folder"));
const jsonArray = [];

//------------------------------------------------------------------------------

const pluginJSON = onlineJSON ("https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json");
const downloadsJSON = onlineJSON ("https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json");
const installedPlugins = app.doShellScript("ls -1 \"" + vaultPath + "\"\"/.obsidian/plugins/\"");

const themeJSON = onlineJSON("https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-css-themes.json");
const installedThemes = app.doShellScript("find '" + vaultPath + "/.obsidian/themes/' -name '*.css' ");
const currentTheme = app.doShellScript("cat \"" + vaultPath + "/.obsidian/appearance.json\" | grep \"cssTheme\" | head -n 1 | cut -d\\\" -f 4"); // eslint-disable-line no-useless-escape
const themeBrowserURI = "obsidian://advanced-uri?vault=" + vaultNameENC + "&settingid=theme-browser";

const deprecatedJSON = JSON.parse(readFile("./data/deprecated-plugins.json"));
const deprecatedPlugins = [
	...deprecatedJSON.sherlocked,
	...deprecatedJSON.dysfunct,
	...deprecatedJSON.deprecated
];

//------------------------------------------------------------------------------


// add PLUGINS to the JSON
pluginJSON.forEach(plugin => {
	const id = plugin.id;
	const name = plugin.name;
	const description = plugin.description
		.replaceAll ("\\\"", "'") // to deal with escaped '"' in descriptions
		.replace (/\. *$/, ""); // trailing dot in description looks weird with the styling done here later in the item subtitle
	const author = plugin.author;
	const repo = plugin.repo;

	const githubURL = "https://github.com/" + repo;
	const openURI = `obsidian://show-plugin?vault=${vaultNameENC}&id=${id}`;
	let isDiscordReady;
	let shareURL;
	if (discordReadyLinks) {
		shareURL = `*${name}* <https://obsidian.md/plugins?id=${id}>`;
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
	let URImatcher = "";
	if (name.includes("URI")) URImatcher = "URL";

	// create json for Alfred
	jsonArray.push({
		"title": name + icons,
		"subtitle": subtitleIcons + description + " — by " + author + downloadsStr,
		"arg": openURI,
		"match":	"plugin " + URImatcher + alfredMatcher (name) + alfredMatcher (author) + alfredMatcher (id) + alfredMatcher (description),
		"mods": {
			"cmd": { "arg": githubURL },
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy Link" + isDiscordReady
			},
			"shift": { "arg": `${repo};${id};${name}` },
			"ctrl": {
				"arg": id,
				"subtitle": `by ${author}   ${downloadsStr}       ID: ${id} (⌃: Copy ID)`
			},
		}
	});
});

// add THEMES to the JSON
themeJSON.forEach(theme => {
	const name = theme.name;
	const author = theme.author;
	const repo = theme.repo;
	let branch;
	if (theme.branch) branch = theme.branch;
	else branch = "master";

	const githubURL = "https://github.com/" + repo;
	const rawGitHub = "https://raw.githubusercontent.com/" + repo + "/" + branch + "/";
	const screenshotURL = rawGitHub + theme.screenshot;

	let isDiscordReady, shareURL;
	if (discordReadyLinks) {
		shareURL = "<" + githubURL + ">";
		isDiscordReady = " (discord ready)";
	} else {
		shareURL = githubURL;
		isDiscordReady = "";
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
		"match": "theme" + alfredMatcher(author) + alfredMatcher(name),
		"arg": themeBrowserURI,
		"quicklookurl": screenshotURL,
		"icon": { "path": "icons/css.png" },
		"mods": {
			"shift": { "arg": repo },
			"cmd":{ "arg": githubURL },
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy GitHub Link" + isDiscordReady
			},
			"ctrl":{
				"valid": false,
				"subtitle": "⛔️ Theme Download numbers not supported yet.",
			},
		},
	});
});

JSON.stringify({ items: jsonArray });

