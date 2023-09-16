#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

/** @param {string} appId */
function SafeApplication(appId) {
	try {
		return Application(appId);
	} catch (_error) {
		return null;
	}
}
const discordReadyLinks = ["Discord", "Discord PTB", "Discord Canary"].some((discordApp) =>
	SafeApplication(discordApp)?.frontmost(),
);
const alfredMatcher = (/** @type {string} */ str) => str.replace(/[-()_.]/g, " ") + " " + str + " ";

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");
	const pluginFolder = `${vaultPath}/${configFolder}/plugins/`;

	const betaRepos = JSON.parse(readFile(pluginFolder + "obsidian42-brat/data.json")).pluginList;
	const betaManifests = betaRepos.map((/** @type {string} */ repoID) => {
		const id = repoID.split("/")[1];
		let author;
		let name;

		const manifest = readFile(pluginFolder + id + "/manifest.json");
		if (manifest) {
			const manifestParsed = JSON.parse(manifest);
			author = manifestParsed.author;
			name = manifestParsed.name;
		} else {
			name = id;
			author = repoID.split("/")[0];
		}

		// in case of missing manifest
		const url = "https://github.com/" + repoID;

		let isDiscordReady = "";
		let shareURL = url;
		if (discordReadyLinks) {
			shareURL = "<" + url + ">";
			isDiscordReady = " (discord-ready)";
		}

		return {
			title: name,
			subtitle: "by " + author,
			match: alfredMatcher(name) + alfredMatcher(author),
			arg: url,
			mods: {
				alt: {
					arg: shareURL,
					subtitle: "⌥: Copy Link" + isDiscordReady,
				},
			},
		};
	});

	return JSON.stringify({ items: betaManifests });
}
