#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
app = Application.currentApplication();
app.includeStandardAdditions = true;

function readFile (path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const jsonArray = [];

const standardSettings = JSON.parse(readFile("./data/settings-database.json"));

const installedPlugins = app.doShellScript("ls -1 \"" + vaultPath + "\"\"/.obsidian/plugins/\"").split("\r");
const enabledComPlugins = JSON.parse(readFile(vaultPath + "/.obsidian/community-plugins.json"));

const corePluginsWithSettings = JSON.parse(readFile("./data/core-plugins-with-settings-database.json"));
const enabledCorePlugins = JSON.parse(readFile(vaultPath + "/.obsidian/core-plugins.json"));

enabledCorePlugins.forEach(pluginID => {
	const hasSettings =
		corePluginsWithSettings
			.map(p => p.id)
			.includes(pluginID);
	if (!hasSettings) return;

	const pluginName = corePluginsWithSettings
		.filter(item => item.id === pluginID)[0]
		.title;

	jsonArray.push({
		"title": pluginName,
		"uid": pluginID,
		"match": pluginName,
		"arg": "obsidian://advanced-uri?settingid=" + pluginID,
		"icon": { "path": "icons/plugin.png" },
		"mods": {
			"alt": { "valid": false },
			"cmd": { "valid": false },
			"ctrl": {
				"arg": pluginID,
				"subtitle": "⌃: Copy plugin ID '" + pluginID + "'",
			}
		},
	});

});

standardSettings.forEach(setting => {

	let idURI = "obsidian://advanced-uri?settingid=" + setting.id;
	if (setting.id === "updateplugins") idURI = "obsidian://advanced-uri?updateplugins=true";

	jsonArray.push({
		"title": setting.title,
		"match": setting.match,
		"uid": setting.id,
		"arg": idURI,
		"mods": {
			"alt": { "valid": false },
			"cmd": { "valid": false },
			"ctrl": { "valid": false },
		}
	});
});

installedPlugins.forEach(pluginFolder => {
	let manifest = "";
	try {
		manifest = JSON.parse(readFile(vaultPath + "/.obsidian/plugins/" + pluginFolder + "/manifest.json"));
	} catch (error) {
		// catches error caused by plugins without "manifest.json" (beta plugins)
		manifest = {
			"id": pluginFolder,
			"name": pluginFolder.replaceAll ("-", " ")
		};
	}

	const pluginFolderPath = vaultPath + "/.obsidian/plugins/" + pluginFolder;
	const finderApp = Application("Finder");
	const isDeveloped = finderApp.exists(Path(pluginFolderPath + "/.git"));
	let devIcon = "";
	if (isDeveloped) devIcon = " ⚙️";

	let pluginEnabled = false;
	let settingSubtitle = "🛑 disabled";
	if (enabledComPlugins.includes(manifest.id)) {
		pluginEnabled = true;
		settingSubtitle = "";
	}

	jsonArray.push({
		"title": manifest.name + devIcon,
		"uid": manifest.id,
		"subtitle": settingSubtitle,
		"arg": "obsidian://advanced-uri?settingid=" + manifest.id,
		"icon": { "path": "icons/plugin.png" },
		"valid": pluginEnabled,
		"mods": {
			"alt": { "arg": pluginFolderPath },
			"cmd": { "arg": pluginFolderPath },
			"ctrl": {
				"arg": manifest.id,
				"subtitle": "⌃: Copy plugin ID '" + manifest.id + "'",
			}
		}
	});
});

JSON.stringify({ items: jsonArray });
