#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function readFile (path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

//------------------------------------------------------------------------------

const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const URIstart = "obsidian://advanced-uri?vault=" + $.getenv("vault_name_ENC");
const jsonArray = [];

const standardSettings = JSON.parse(readFile("./data/settings-database.json"));

const installedPlugins = app.doShellScript("ls -1 \"" + vaultPath + "\"\"/.obsidian/plugins/\"").split("\r");
const enabledComPlugins = JSON.parse(readFile(vaultPath + "/.obsidian/community-plugins.json"));

const corePluginsWithSettings = JSON.parse(readFile("./data/core-plugins-with-settings-database.json"));
const enabledCorePlugins = JSON.parse(readFile(vaultPath + "/.obsidian/core-plugins.json"));

const deprecatedJSON = JSON.parse(readFile("./data/deprecated-plugins.json"));
const deprecatedPlugins = [
	...deprecatedJSON.sherlocked,
	...deprecatedJSON.dysfunct,
	...deprecatedJSON.deprecated
];

//------------------------------------------------------------------------------

enabledCorePlugins.forEach(pluginID => {
	const hasSettings =
		corePluginsWithSettings
			.map(p => p.id)
			.includes(pluginID);
	if (!hasSettings) return;

	const pluginName = corePluginsWithSettings
		.filter(item => item.id === pluginID)[0]
		.title;

	const URI = URIstart + "&settingid=" + pluginID;

	jsonArray.push({
		"title": pluginName,
		"uid": pluginID,
		"match": pluginName,
		"arg": URI,
		"icon": { "path": "icons/plugin.png" },
		"mods": {
			"alt": { "valid": false },
			"cmd": { "valid": false },
			"fn": { "valid": false },
			"ctrl": {
				"arg": pluginID,
				"subtitle": "⌃: Copy plugin ID '" + pluginID + "'",
			}
		},
	});

});

standardSettings.forEach(setting => {

	let URI = URIstart + "&settingid=" + setting.id;
	if (setting.id === "updateplugins") URI = URIstart + "&updateplugins=true";

	jsonArray.push({
		"title": setting.title,
		"match": setting.match,
		"uid": setting.id,
		"arg": URI,
		"mods": {
			"alt": { "valid": false },
			"cmd": { "valid": false },
			"ctrl": { "valid": false },
			"fn": { "valid": false },
		}
	});
});

installedPlugins.forEach(pluginFolder => {
	const pluginFolderPath = vaultPath + "/.obsidian/plugins/" + pluginFolder;

	let manifest = "";
	try {
		manifest = JSON.parse(readFile(pluginFolderPath + "/manifest.json"));
	} catch (error) {
		// catches error caused by plugins without "manifest.json" (beta plugins)
		manifest = {
			"id": pluginFolder,
			"name": pluginFolder.replaceAll ("-", " ")
		};
	}
	const name = manifest.name;
	const pluginID = manifest.id;
	const URI = `${URIstart}&settingid=${pluginID}`;

	// toggling
	const pluginEnabled = enabledComPlugins.includes(pluginID);
	const settingSubtitle = pluginEnabled ? "" : "🟥 disabled";
	const toggleSubtitle = pluginEnabled ? "⇧: 🟥 disable" : "⇧: 🟢 enable";
	const toggleMode = pluginEnabled ? "disable-plugin" : "enable-plugin";
	const toggleURI = `${URIstart}&${toggleMode}=${pluginID}`;

	// icons
	let icons = "";
	let subtitleIcons = "";
	if (deprecatedPlugins.includes(pluginID)) {
		icons += "⚠️ ";
		subtitleIcons = "deprecated";
	}
	if (name === "Style Settings") icons += " 🎨";
	const isDeveloped = Application("Finder").exists(Path(pluginFolderPath + "/.git"));
	let devSubtitle = "No '.git' folder found.";
	if (isDeveloped) {
		icons += " ⚙️";
		devSubtitle = "fn: git pull";
	}

	jsonArray.push({
		"title":name + icons,
		"uid": pluginID,
		"subtitle": subtitleIcons + settingSubtitle,
		"arg": URI,
		"icon": { "path": "icons/plugin.png" },
		"valid": pluginEnabled,
		"mods": {
			"alt": { "arg": pluginFolderPath },
			"cmd": { "arg": pluginFolderPath },
			"fn": {
				"arg": pluginFolderPath,
				"valid": isDeveloped,
				"subtitle": devSubtitle,
			},
			"shift": {
				"arg": toggleURI,
				"valid": true,
				"subtitle": toggleSubtitle,
			},
			"ctrl": {
				"arg": pluginID,
				"subtitle": `⌃: Copy plugin ID '${pluginID}'`,
			}
		}
	});
});

JSON.stringify({ items: jsonArray });
