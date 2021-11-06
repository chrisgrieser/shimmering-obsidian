#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib');
app = Application.currentApplication();
app.includeStandardAdditions = true;

function alfredMatcher (str){
	return str.replace (/[-\(\)_\.]/g," ") + " " + str;
}
function onlineJSON (url){
	return JSON.parse (app.doShellScript('curl -s "' + url + '"'));
}
function insert1000sep (num){
	let numText = String(num);
	if (num >= 10000) numText =
		numText.slice(0, -3) +
		$.getenv('thousand_separator') +
		numText.slice (-3);
	return numText;
}

const homepath = app.pathTo('home folder');
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
let jsonArray = [];

const pluginJSON = onlineJSON ("https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json");
const downloadsJSON = onlineJSON ('https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json');
const themeJSON = onlineJSON('https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-css-themes.json');
const installed_plugins = app.doShellScript('ls -1 "' + vault_path + '""/.obsidian/plugins/"');
const installed_themes = app.doShellScript("find '" + vault_path + "/.obsidian/themes/' -name '*.css' ");
const current_theme = app.doShellScript('cat "' + vault_path + '/.obsidian/appearance.json' +'" | grep "cssTheme" | head -n 1 | cut -d\\\" -f 4');

//add PLUGINS to the JSON
pluginJSON.forEach(plugin => {
	let id = plugin.id;
	let name = plugin.name;
	let description = plugin.description.replaceAll ('\\"',"'"); // to deal with escaped '"' in descriptions
	let author = plugin.author;
	let repo = plugin.repo;

	let githubURL = "https://github.com/" + repo;
	let plugin_uri = "obsidian://goto-plugin?id=" + id; // Community Browser URI with Hotkey Helper https://github.com/pjeby/hotkey-helper#plugin-urls

	// Download Numbers
	let downloads_str = "";
	if (downloadsJSON[id]){
		let downloads = downloadsJSON[id].downloads;
		downloads_str = "  ↓ " + insert1000sep(downloads);
	}

 	//check whether already installed
 	let installed_icon = "";
 	let open_config_valid = false;
 	let config_subtitle = "⛔️ Configuration not available for uninstalled plugins.";
 	if (installed_plugins.includes(id)){
 		installed_icon = " ✅";
 		open_config_valid = true;
 		config_subtitle = "⌃: Open '" + name + "' Configuration";
 	}
 	let URImatcher = "";
 	if (name.includes("URI")) URImatcher = "URL ";

	//create json for Alfred
	jsonArray.push({
		'title': name + installed_icon,
		'subtitle': description + " — by " + author + downloads_str,
		'arg': plugin_uri,
		'match':	"plugin " + URImatcher + alfredMatcher (name) + " "	+ alfredMatcher (author) + " " + alfredMatcher (id),
		'mods': {
			'cmd': {'arg': githubURL },
			'alt': {'arg': githubURL },
			'fn': {'arg': githubURL },
			'shift': {'arg': repo + ";" + id + ";" + name},
			'ctrl':{
				'valid': open_config_valid,
				'arg': plugin_uri + "&show=config",
				'subtitle': config_subtitle,
			},
		}
	});
});

// add THEMES to the JSON
themeJSON.forEach(theme => {
	let name = theme.name;
 	let author = theme.author;
 	let repo = theme.repo;
 	let branch;
 	if (theme.branch) branch = theme.branch;
 	else branch = "master";

 	let githubURL = "https://github.com/" + repo;
 	let rawGitHub = "https://raw.githubusercontent.com/" + repo + "/" + branch + "/";
  	let screenshotURL = rawGitHub + theme.screenshot;
  	let cssURL = rawGitHub + "obsidian.css";

	let modes = "";
	let installed_icon = "";
	if (theme.modes){
		if (theme.modes.includes("light")) modes += "☀️ ";
		if (theme.modes.includes("dark")) modes += "🌒 ";
	}
 	if (installed_themes.includes(name)) installed_icon = " ✅";
 	if (current_theme == name) installed_icon = " ⭐️";

	//create json for Alfred
	jsonArray.push({
		'title': name + installed_icon,
		'subtitle': modes + "  by " + author,
		'match': "theme " + author + " " + alfredMatcher(name),
		'arg': githubURL,
		"quicklookurl": screenshotURL,
		"icon": { "path": "icons/css.png" },
		'mods': {
			'fn': {
				'arg': cssURL,
				'subtitle': "fn: Download Theme CSS",
			},
			'ctrl':{
				'valid': false,
				'subtitle': "⛔️ Themes have no configuration.",
			},
			'shift': {'arg': repo },
		},
	});
});

JSON.stringify({ items: jsonArray });

