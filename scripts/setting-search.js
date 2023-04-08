#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

//------------------------------------------------------------------------------

function getVaultPath() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
}
const vaultPath = getVaultPath();

function getVaultNameEncoded() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const theVaultPath = ObjC.unwrap(vault)
	const vaultName = theVaultPath.replace(/.*\//, "")
	return encodeURIComponent(vaultName);
}

const uriStart = "obsidian://advanced-uri?vault=" + getVaultNameEncoded();
const jsonArray = [];

const standardSettings = JSON.parse(readFile("./data/settings-database.json"));

const installedPlugins = app.doShellScript('ls -1 "' + vaultPath + '""/.obsidian/plugins/"').split("\r");
const enabledComPlugins = JSON.parse(readFile(vaultPath + "/.obsidian/community-plugins.json"));

const corePluginsWithSettings = JSON.parse(readFile("./data/core-plugins-with-settings-database.json"));
const enabledCorePlugins = JSON.parse(readFile(vaultPath + "/.obsidian/core-plugins.json"));

const deprecatedJSON = JSON.parse(readFile("./data/deprecated-plugins.json"));
const deprecatedPlugins = [...deprecatedJSON.sherlocked, ...deprecatedJSON.dysfunct, ...deprecatedJSON.deprecated];

//------------------------------------------------------------------------------

enabledCorePlugins.forEach(pluginID => {
	const hasSettings = corePluginsWithSettings.map(p => p.id).includes(pluginID);
	if (!hasSettings) return;

	const pluginName = corePluginsWithSettings.filter(item => item.id === pluginID)[0].title;

	const URI = uriStart + "&settingid=" + pluginID;

	jsonArray.push({
		title: pluginName,
		uid: pluginID,
		match: pluginName,
		arg: URI,
		icon: { path: "icons/plugin.png" },
		mods: {
			alt: { valid: false },
			cmd: { valid: false },
			fn: { valid: false },
			ctrl: {
				arg: pluginID,
				subtitle: "⌃: Copy plugin ID '" + pluginID + "'",
			},
		},
	});
});

standardSettings.forEach(setting => {
	let URI = uriStart + "&settingid=" + setting.id;
	if (setting.id === "updateplugins") URI = uriStart + "&updateplugins=true";

	jsonArray.push({
		title: setting.title,
		match: setting.match,
		uid: setting.id,
		arg: URI,
		mods: {
			alt: { valid: false },
			cmd: { valid: false },
			ctrl: { valid: false },
			fn: { valid: false },
		},
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
			id: pluginFolder,
			name: pluginFolder.replaceAll("-", " "),
		};
	}
	const name = manifest.name;
	const pluginID = manifest.id;
	const URI = `${uriStart}&settingid=${pluginID}`;

	// toggling
	const pluginEnabled = enabledComPlugins.includes(pluginID);
	const settingSubtitle = pluginEnabled ? "" : "🟥 disabled";
	const toggleSubtitle = pluginEnabled ? "⇧: 🟥 disable" : "⇧: 🟢 enable";
	const toggleMode = pluginEnabled ? "disable-plugin" : "enable-plugin";
	const toggleURI = `${uriStart}&${toggleMode}=${pluginID}`;

	// icons
	let icons = "";
	let subtitleIcons = "";
	if (deprecatedPlugins.includes(pluginID)) {
		icons += "⚠️ ";
		subtitleIcons = "deprecated";
	}
	if (name === "Style Settings") icons += " 🎨";
	const isDeveloped = Application("Finder").exists(Path(pluginFolderPath + "/.git"));
	if (isDeveloped) icons += " ⚙️";

	jsonArray.push({
		title: name + icons,
		uid: pluginID,
		subtitle: subtitleIcons + settingSubtitle,
		arg: URI,
		icon: { path: "icons/plugin.png" },
		mods: {
			alt: { arg: pluginFolderPath },
			cmd: { arg: pluginFolderPath },
			shift: {
				arg: toggleURI,
				valid: true,
				subtitle: toggleSubtitle,
			},
			ctrl: {
				arg: pluginID,
				subtitle: `⌃: Copy plugin ID '${pluginID}'`,
			},
		},
	});
});

JSON.stringify({ items: jsonArray });
