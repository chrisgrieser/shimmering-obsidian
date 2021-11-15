#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib');
ObjC.import('Foundation');
app = Application.currentApplication();
app.includeStandardAdditions = true;

const readFile = function (path, encoding) {
    !encoding && (encoding = $.NSUTF8StringEncoding);
    const fm = $.NSFileManager.defaultManager;
    const data = fm.contentsAtPath(path);
    const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
    return ObjC.unwrap(str);
};

const vault_path = $.getenv("vault_path").replace(/^~/, app.pathTo('home folder'));
const standard_settings = JSON.parse(readFile("./data/settings-database.json"));
const installed_plugins = app.doShellScript('ls -1 "' + vault_path + '""/.obsidian/plugins/"').split("\r");
const enabled_core_plugins = JSON.parse(readFile(vault_path + "/.obsidian/core-plugins.json"));
const enabled_com_plugins = JSON.parse(readFile(vault_path + "/.obsidian/community-plugins.json"));
let jsonArray = [];

standard_settings.forEach(setting =>{
	jsonArray.push({
		'title': setting.title,
		'match': setting.match,
		'uid': setting.id,
		'arg': "obsidian://advanced-uri?settingid=" + setting.id,
		"mods": {
			"alt": {
				"valid": false,
				"subtitle": "⛔️ No folder available for main settings.",
			},
		}
	});
});

installed_plugins.forEach(pluginFolder =>{
	let manifest = "";
	try {
		manifest = JSON.parse(readFile(vault_path + "/.obsidian/plugins/" + pluginFolder + "/manifest.json"));
	} catch (error) {
		// catches error caused by polugins with "manifest.json" (beta plugins)
		manifest = {
			"id": pluginFolder,
			"name": pluginFolder.replaceAll ("-", " "),
			"version": "Manifest.json missing. Ask developer to add it.",
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
		'subtitle': manifest.version,
		'uid': pluginID,
		'match': manifest.name + " " + manifest.description,
		'arg': "obsidian://advanced-uri?settingid=" + pluginID,
		'icon': {'path': "icons/plugin.png"},
		'valid': pluginEnabled,
		"mods": {
			"alt": {
				"arg": pluginFolderPath,
			},
		}
	});
});

JSON.stringify({ items: jsonArray });
