#!/usr/bin/env osascript -l JavaScript
ObjC.import('stdlib');
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo('home folder');

// get all community plugins
var plugin_array = app.doShellScript('curl -s "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json" | grep ' + "'" + '"id":' +  "' -A 4").split("--\r");

// get plugin download numbers
var download_array = app.doShellScript('curl -s "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json" | grep -E ": {|downloads" | tr "\n" "§" | sed -E "s/\{\§//g" | tr "§" "\n" | tr -d ' + "'" + '" ,' + "'" + ' | cut -d ":" -f 1,3').split("\r");

// get community themes
theme_array = app.doShellScript('curl -s "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-css-themes.json" | grep ' + "'" + '"name":' +  "' -A 5").split("--\r");

// get installed plugins
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const installed_plugins = app.doShellScript('ls -1 "' + vault_path + '""/.obsidian/plugins/"');

// get installed/current themes
const theme_path = vault_path + "/.obsidian/themes/";
const installed_themes = app.doShellScript("find '" + theme_path + "' -name '*.css' ");
const current_theme = app.doShellScript('cat "' + vault_path + '/.obsidian/appearance.json' +'" | grep "cssTheme" | head -n 1 | cut -d ' + "'" + '"' + "'" + ' -f 4').replace (/\.css$/,"");


//JSON reading
function readJSON (json, lineNo){
	if (json.split("\r")[lineNo] == null) return null;
	return json.split("\r")[lineNo].split('"')[3];
}
let jsonArray = [];

//add PLUGINS to the JSON
var i = 0;
plugin_array.forEach(plugin => {
	// to deal with escaped '"' in descriptions
	plugin = plugin.replaceAll ('\\"',"'");

	let id = readJSON (plugin, 0);
	let plugin_name = readJSON (plugin, 1);

	// because sometimes author and description are switched in the JSON :(
	let description, author;
	if (plugin.match(/.*author.*?description/s) != null){
		description = readJSON (plugin, 3);
		author = readJSON (plugin, 2);
	} else {
		description = readJSON (plugin, 2);
		author = readJSON (plugin, 3);
	}
	let githubURL = "https://github.com/" + readJSON (plugin, 4);

	//get download numbers
	//1st if-condition ensures that the plugin has download stats (new plugins dont)
	//the 2nd if-condition is a precaution in case the order of the two jsons isnt in
	//sync anymore. In that case, no download-numbers are shown rather than a false one
 	let downloads = "";
 	if (i < download_array.length){
	 	if (download_array[i].includes(id)){
			downloads = download_array[i].split(":")[1];
			downloads = downloads.replace(/(.+)(.{3})$/,"$1"+$.getenv('thousand_seperator') +"$2");
			downloads = "  ↓ " + downloads;
	 	}
		i++;
 	}

 	//check whether already installed
 	let installed_icon = "";
 	if (installed_plugins.includes(id)){
 		installed_icon = " ✅"
 	}

	//create json for Alfred
	jsonArray.push({
		'title': plugin_name + installed_icon,
		'subtitle': description + " — by " + author + downloads,
		'arg': plugin_name,
		'mods': {
			'cmd':{
				'arg': githubURL,
			},
			'alt':{
				'arg': githubURL,
			},
			'fn':{
				'arg': githubURL,
			},
		}
	});
});

// add THEMES to the JSON
theme_array.forEach(theme => {
	let theme_name = readJSON (theme, 0);
 	let author = readJSON (theme, 1);
 	let repo = readJSON (theme, 2);

 	let branch = "master"
 	let branch_info = readJSON (theme, 5);
 	if (branch_info != null){
		branch = branch_info;
 	}
 	let screenshotFile = readJSON (theme, 3);
 	let githubURL = "https://github.com/" + repo;
  	let screenshotURL =
  		"https://raw.githubusercontent.com/"
  		+ repo + "/" + branch + "/"
  		+ screenshotFile
  	;
  	let cssURL = githubURL + "/obsidian.css";

	//determine available modes
	let modes = ""
	if (theme.split("\r")[4].includes("light")){
		modes += "☀️ ";
	}
	if (theme.split("\r")[4].includes("dark")){
		modes += "🌒 ";
	}

	//determine installation status
	let installed_icon = "";
 	if (installed_themes.includes(theme_name)){
 		installed_icon = " ✅"
 	}
 	if (current_theme == theme_name){
		installed_icon = " ⭐️";
	}

	// better matching for Alfred
	// and enables searching only for themes when using "op themes" as keyword
	let alfredMatcher = "themes" + " " + theme_name.replaceAll ("-"," ") + " " + "themes";

	//create json for Alfred
	jsonArray.push({
		'title': theme_name + installed_icon,
		'subtitle': modes + "  by " + author,
		'match': alfredMatcher,
		'arg': githubURL,
		"quicklookurl": screenshotURL,
		"icon": { "path": "css.png" },
		'mods': {
			'fn': {
				'arg': cssURL,
				'subtitle': "fn: Download Theme CSS",
			}
		},
	});
});

JSON.stringify({ items: jsonArray });

