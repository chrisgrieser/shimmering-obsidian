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

function SafeApplication(appId) {
	try {
		return Application(appId);
	} catch (error) {
		return null;
	}
}
const discordReadyLinks = ["Discord", "Discord PTB", "Discord Canary"]
	.some(discordApp => SafeApplication(discordApp)?.frontmost());
const alfredMatcher = (str) => str.replace (/[-()_.]/g, " ") + " " + str + " ";

function getVaultPath() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
}

const pluginFolder = getVaultPath().replace(/^~/, app.pathTo("home folder")) + "/.obsidian/plugins/";
//──────────────────────────────────────────────────────────────────────────────

const betaRepos = JSON.parse(readFile(pluginFolder + "obsidian42-brat/data.json")).pluginList;
const betaManifests = betaRepos
	.map (repoID => {
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
			"title": name,
			"subtitle": "by " + author,
			"match": alfredMatcher (name) + alfredMatcher (author),
			"arg": url,
			"mods": {
				"alt": {
					"arg": shareURL,
					"subtitle": "⌥: Copy Link" + isDiscordReady,
				},
			},
		};
	});

JSON.stringify({ items: betaManifests });
