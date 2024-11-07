#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");
	const vaultNameEnc = encodeURIComponent(vaultPath.replace(/.*\//, ""));

	const uriStart = "obsidian://advanced-uri?vault=" + vaultNameEnc;

	const standardSettings = JSON.parse(readFile("./data/settings-database.json"));

	const installedPlugins = app
		.doShellScript(`ls -1 "${vaultPath}/${configFolder}/plugins/"`)
		.split("\r");
	const enabledComPlugins = JSON.parse(
		readFile(`${vaultPath}/${configFolder}/community-plugins.json`),
	);

	const corePluginsWithSettings = JSON.parse(
		readFile("./data/core-plugins-with-settings-database.json"),
	);
	const enabledCorePlugins = JSON.parse(
		readFile(`${vaultPath}/${configFolder}/core-plugins.json`),
	);

	const deprecated = JSON.parse(readFile("./data/deprecated-plugins.json"));
	const deprecatedPlugins = [
		...deprecated.sherlocked,
		...deprecated.dysfunct,
		...deprecated.deprecated,
	];

	//──────────────────────────────────────────────────────────────────────────────
	const settings = [];

	for (const [pluginID, enabled] of Object.entries(enabledCorePlugins)) {
		if (!enabled) continue;
		const hasSettings = corePluginsWithSettings
			.map((/** @type {{ id: string; }} */ p) => p.id)
			.includes(pluginID);
		if (!hasSettings) continue;

		const pluginName = corePluginsWithSettings.filter(
			(/** @type {{ id: string; }} */ item) => item.id === pluginID,
		)[0].title;

		const uri = uriStart + "&settingid=" + pluginID;
		const invalid = { valid: false, subtitle: "Not available for core plugins." };

		settings.push({
			title: pluginName,
			uid: pluginID,
			match: pluginName,
			arg: uri,
			icon: { path: "icons/plugin.png" },
			mods: {
				alt: invalid,
				cmd: invalid,
				fn: invalid,
				shift: invalid,
				ctrl: {
					arg: pluginID,
					subtitle: "⌃: Copy plugin ID '" + pluginID + "'",
				},
			},
		});
	}

	standardSettings.forEach(
		(/** @type {{ id: string; title: string; match: string; }} */ setting) => {
			let uri = uriStart + "&settingid=" + setting.id;
			if (setting.id === "updateplugins") uri = uriStart + "&updateplugins=true";

			const invalid = { valid: false, subtitle: "Not available for settings." };

			settings.push({
				title: setting.title,
				match: setting.match,
				uid: setting.id,
				arg: uri,
				mods: {
					alt: invalid,
					cmd: invalid,
					shift: invalid,
					ctrl: invalid,
					fn: invalid,
				},
			});
		},
	);

	installedPlugins.forEach((pluginFolder) => {
		const pluginFolderPath = `${vaultPath}/${configFolder}/plugins/${pluginFolder}`;

		let manifest = {};
		try {
			manifest = JSON.parse(readFile(pluginFolderPath + "/manifest.json"));
		} catch (_error) {
			// catches error caused by plugins without "manifest.json" (beta plugins)
			manifest = {
				id: pluginFolder,
				name: pluginFolder.replaceAll("-", " "),
			};
		}
		const name = manifest.name;
		const pluginID = manifest.id;
		const uri = `${uriStart}&settingid=${pluginID}`;

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

		settings.push({
			title: name + icons,
			uid: pluginID,
			subtitle: subtitleIcons + settingSubtitle,
			arg: uri,
			icon: { path: "icons/plugin.png" },
			mods: {
				alt: { arg: pluginFolderPath },
				cmd: { arg: pluginFolderPath },
				shift: {
					arg: toggleURI,
					subtitle: toggleSubtitle,
				},
				ctrl: {
					arg: pluginID,
					subtitle: `⌃: Copy plugin ID '${pluginID}'`,
				},
			},
		});
	});

	return JSON.stringify({ items: settings });
}
