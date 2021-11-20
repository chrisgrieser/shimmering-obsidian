#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib');
ObjC.import('Foundation');
app = Application.currentApplication();
app.includeStandardAdditions = true;

function readFile (path, encoding) {
    if (!encoding) encoding = $.NSUTF8StringEncoding;
    const fm = $.NSFileManager.defaultManager;
    const data = fm.contentsAtPath(path);
    const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
    return ObjC.unwrap(str);
}

const vault_path = $.getenv("vault_path").replace(/^~/, app.pathTo('home folder'));
let jsonArray = [];

const standard_settings = JSON.parse(readFile("./data/settings-database.json"));

const installed_plugins = app.doShellScript('ls -1 "' + vault_path + '""/.obsidian/plugins/"').split("\r");
const enabled_com_plugins = JSON.parse(readFile(vault_path + "/.obsidian/community-plugins.json"));

const corePluginsWithSettings = JSON.parse(readFile("./data/core-plugins-with-settings-database.json"));
const enabled_core_plugins = JSON.parse(readFile(vault_path + "/.obsidian/core-plugins.json"));

enabled_core_plugins.forEach(pluginID =>{
	let hasSettings =
		corePluginsWithSettings
		.map(p => p.id)
		.includes(pluginID);
	if (!hasSettings) return;

	let pluginName = corePluginsWithSettings
		.filter(item => item.id == pluginID)
		[0].title;

	jsonArray.push({
		'title': pluginName,
		'uid': pluginID,
		'match': pluginName,
		'arg': "obsidian://advanced-uri?settingid=" + pluginID,
		'icon': {'path': "icons/plugin.png"},
		"mods": {
			"alt": {
				"valid": false,
			},
			"cmd": {
				"valid": false,
			},
			"ctrl": {
				"arg": pluginID,
				"subtitle": "⌃: Copy plugin ID '" + pluginID + "'",
			}
		},
	});

});

standard_settings.forEach(setting =>{

	let idURI = "obsidian://advanced-uri?settingid=" + setting.id;
	if (setting.id == "updateplugins") idURI = "obsidian://advanced-uri?updateplugins=true";

	jsonArray.push({
		'title': setting.title,
		'match': setting.match,
		'uid': setting.id,
		'arg': idURI,
		"mods": {
			"alt": {
				"valid": false,
			},
			"cmd": {
				"valid": false,
			},
			"ctrl": {
				"valid": false,
			},
		}
	});
});

installed_plugins.forEach(pluginFolder =>{
	let manifest = "";
	try {
		manifest = JSON.parse(readFile(vault_path + "/.obsidian/plugins/" + pluginFolder + "/manifest.json"));
	} catch (error) {
		// catches error caused by plugins without "manifest.json" (beta plugins)
		manifest = {
			"id": pluginFolder,
			"name": pluginFolder.replaceAll ("-", " "),
			"description": ""
		};
	}
	let pluginID = manifest.id;
	let pluginFolderPath = vault_path + "/.obsidian/plugins/" + pluginFolder;

	let pluginEnabled = false;
	let titleSuffix = " 🛑";
	if (enabled_com_plugins.includes(pluginID)) {
		pluginEnabled = true;
		titleSuffix = "";
	}

	jsonArray.push({
		'title': manifest.name + titleSuffix,
		'uid': pluginID,
		'match': manifest.name + " " + manifest.description,
		'arg': "obsidian://advanced-uri?settingid=" + pluginID,
		'icon': {'path': "icons/plugin.png"},
		'valid': pluginEnabled,
		"mods": {
			"alt": {
				"arg": pluginFolderPath,
			},
			"cmd": {
				"arg": pluginFolderPath,
			},
			"ctrl": {
				"arg": pluginID,
				"subtitle": "⌃: Copy plugin ID '" + pluginID + "'",
			}
		}
	});
});

JSON.stringify({ items: jsonArray });
