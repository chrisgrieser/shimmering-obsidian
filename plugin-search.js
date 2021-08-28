#!/usr/bin/env osascript -l JavaScript
ObjC.import('stdlib');
app = Application.currentApplication();
app.includeStandardAdditions = true;

// get all community plugins
var work_array = app.doShellScript('curl -s "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json" | grep ' + "'" + '"id":' +  "' -A 4").split("--");
work_array[0] = "\r" + work_array[0]; //has to be added b/c of grep -A

// to get download numbers
var download_array = app.doShellScript('curl -s "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json" | grep -E ": {|downloads" | tr "\n" "§" | sed -E "s/\{\§//g" | tr "§" "\n" | tr -d ' + "'" + '" ,' + "'" + ' | cut -d ":" -f 1,3').split("\r");

// get installed plugins
const homepath = app.pathTo('home folder');
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
var installed_plugins = app.doShellScript('ls -1 "' + vault_path + '""/.obsidian/plugins/"');


function readJSON (json, lineNo){
	return json.split("\r")[lineNo].split('"')[3];
}

let jsonArray = [];
var i = 0;
work_array.forEach(plugin => {
	// to deal with escaped '"' in descriptions
	plugin = plugin.replaceAll ('\\"',"'");
	let id = readJSON (plugin, 1);
	let name = readJSON (plugin, 2);

	// because sometimes author and description are switched in the JSON :(
	let description, author;
	if (plugin.match(/.*author.*?description/s) != null){
		description = readJSON (plugin, 4);
		author = readJSON (plugin, 3);
	} else {
		description = readJSON (plugin, 3);
		author = readJSON (plugin, 4);
	}
	let githubURL = "https://github.com/" + readJSON (plugin, 5);

	//get download numbers
	//1st if-condition ensures that the plugin has download stats (new plugins dont)
	//(new plugins do not have stats yet)
	//the 2nd if-condition is a precaution in case the order of the two jsons isnt in
	//sync anymore. In that case, no download-numbers are shown rather than a false one
 	let downloads = "";
 	if (i < download_array.length){
	 	if (download_array[i].includes(id)){
			downloads = download_array[i].split(":")[1];
			downloads = downloads.replace(/(.+)(.{3})$/,"$1"+$.getenv('thousand_seperator') +"$2");
			downloads = "   ↓ " + downloads;
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
		'title': name + installed_icon,
		'subtitle': description + " — by " + author + downloads,
		'arg': name,
		'mods': {
			'cmd':{
				'arg': githubURL,
				'subtitle': "⌘: Open GitHub Repository",
			},
			'alt':{
				'arg': githubURL,
				'subtitle': "⌥: Copy GitHub Link",
			},
		}
	});
});

JSON.stringify({ items: jsonArray });

