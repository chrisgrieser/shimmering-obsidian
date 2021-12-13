#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function alfredMatcher (str) {
	return " " + str.replace (/[-()_.@]/g, " ") + " " + str;
}
function onlineJSON (url) {
	return JSON.parse (app.doShellScript("curl -s \"" + url + "\""));
}
function insert1000sep (num) {
	let numText = String(num);
	if (num >= 10000) {numText =
		numText.slice(0, -3) +
		$.getenv("thousand_separator") +
		numText.slice (-3);}
	return numText;
}

const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const discordReadyLinks = $.getenv("discord_ready_links") === "true";
const jsonArray = [];

const pluginJSON = onlineJSON ("https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json");
const downloadsJSON = onlineJSON ("https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json");
const themeJSON = onlineJSON("https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-css-themes.json");
const installedPlugins = app.doShellScript("ls -1 \"" + vaultPath + "\"\"/.obsidian/plugins/\"");
const installedThemes = app.doShellScript("find '" + vaultPath + "/.obsidian/themes/' -name '*.css' ");
const currentTheme = app.doShellScript("cat \"" + vaultPath + "/.obsidian/appearance.json\" | grep \"cssTheme\" | head -n 1 | cut -d\\\" -f 4"); // eslint-disable-line no-useless-escape

// add PLUGINS to the JSON
pluginJSON.forEach(plugin => {
	const id = plugin.id;
	const name = plugin.name;
	const description = plugin.description.replaceAll ("\\\"", "'"); // to deal with escaped '"' in descriptions
	const author = plugin.author;
	const repo = plugin.repo;

	const githubURL = "https://github.com/" + repo;
	const pluginUri = "obsidian://goto-plugin?id=" + id; // Community Browser URI with Hotkey Helper https://github.com/pjeby/hotkey-helper#plugin-urls
	let isDiscordReady, shareURL;
	if (discordReadyLinks) {
		shareURL = "<" + githubURL + ">";
		isDiscordReady = " (discord ready)";
	} else {
		shareURL = githubURL;
		isDiscordReady = "";
	}

	// Download Numbers
	let downloadsStr = "";
	if (downloadsJSON[id]) {
		const downloads = downloadsJSON[id].downloads;
		downloadsStr = "  ↓ " + insert1000sep(downloads);
	}

	// check whether already installed
	let installedIcon = "";
	if (installedPlugins.includes(id)) installedIcon = " ✅";

	// Better matching for some plugins
	let URImatcher = "";
	if (name.includes("URI")) URImatcher = "URL";

	// create json for Alfred
	jsonArray.push({
		"title": name + installedIcon,
		"subtitle": description + " — by " + author + downloadsStr,
		"arg": pluginUri,
		"match":	"plugin " + URImatcher + alfredMatcher (name) + alfredMatcher (author) + alfredMatcher (id) + alfredMatcher (description),
		"mods": {
			"cmd": { "arg": githubURL },
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy GitHub Link" + isDiscordReady
			},
			"fn": { "arg": githubURL },
			"shift": { "arg": repo + ";" + id + ";" + name },
			"ctrl": {
				"arg": id,
				"subtitle": "by " + author + "   " + downloadsStr + "       ID: " + id + " (⌃: Copy ID)"
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
	const cssURL = rawGitHub + "obsidian.css";

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
		"arg": githubURL,
		"quicklookurl": screenshotURL,
		"icon": { "path": "icons/css.png" },
		"mods": {
			"shift": { "arg": repo },
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy GitHub Link" + isDiscordReady
			},
			"fn": {
				"arg": cssURL,
				"subtitle": "fn: Download Theme CSS",
			},
			"ctrl":{
				"valid": false,
				"subtitle": "⛔️ Theme Download numbers not supported yet.",
			},
		},
	});
});

JSON.stringify({ items: jsonArray });

