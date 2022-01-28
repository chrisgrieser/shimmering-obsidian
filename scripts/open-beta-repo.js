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
const bratDataJson = getEnv("vault_path") + "/.obsidian/plugins/obsidian42-brat/data.json";

const jsonArray = [];
const betaRepos = JSON.parse(readFile(bratDataJson)).pluginList;

betaRepos.forEach(repo => {

	const url = "https://github.com/" + repo;
	const author = repo.split("/")[0];
	let name = repo.split("/")[1];

	let isDiscordReady = "";
	let shareURL = url;
	if (discordReadyLinks) {
		shareURL = "<" + url + ">";
		isDiscordReady = " (discord-ready)";
	}

	jsonArray.push({
		"title": name,
		"subtitle": "by " + author,
		"match": alfredMatcher (name) + alfredMatcher (author),
		"arg": url,
		"mods": {
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy Link" + isDiscordReady
			}
		}
	});
});

JSON.stringify({ items: jsonArray });
