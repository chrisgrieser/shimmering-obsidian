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

function SafeApplication(appId) {
	try {
		return Application(appId);
	} catch (e) {
		return null;
	}
}
const discordReadyLinks = ["Discord", "Discord PTB", "Discord Canary"]
	.some(discordApp => SafeApplication(discordApp)?.frontmost());
const alfredMatcher = (str) => str.replace (/[-()_.]/g, " ") + " " + str + " ";
const getEnv = (path) => $.getenv(path).replace(/^~/, app.pathTo("home folder"));
const pluginFolder = getEnv("vault_path") + "/.obsidian/plugins/";

const jsonArray = [];
const betaRepos = JSON.parse(readFile(pluginFolder + "obsidian42-brat/data.json")).pluginList;
const betaManifests = betaRepos
	.map (repo => {
		const id = repo.split("/")[1];
		const author = repo.split("/")[0];
		const fallback = { name: id, author: author, repo: repo };

		const manifest = readFile(pluginFolder + id + "/manifest.json");
		if (!manifest) return fallback;
		return JSON.parse(manifest);
	});

betaManifests.forEach(manifest => {
	const url = "https://github.com/" + manifest.repo;

	let isDiscordReady = "";
	let shareURL = url;
	if (discordReadyLinks) {
		shareURL = "<" + url + ">";
		isDiscordReady = " (discord-ready)";
	}

	jsonArray.push({
		"title": manifest.name,
		"subtitle": "by " + manifest.author,
		"match": alfredMatcher (manifest.name) + alfredMatcher (manifest.author),
		"arg": "https://github.com/" + manifest.repo,
		"mods": {
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy Link" + isDiscordReady
			}
		}
	});
});

JSON.stringify({ items: jsonArray });
