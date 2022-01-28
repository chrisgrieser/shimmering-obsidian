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
const baseURL = "https://forum.obsidian.md/c/";

const jsonArray = [];
const forumDataJSON =
	$.getenv("alfred_preferences") + "/workflows/"
	+ $.getenv("alfred_workflow_uid")
	+ "/data/forum-categories.json";
const workArray = JSON.parse(readFile(forumDataJSON));


workArray.forEach(category => {
	const url = baseURL + category.browseURL;
	let shareURL = url;
	let discordReady = "";
	if (discordReadyLinks) {
		shareURL = "<" + url + ">";
		discordReady = " (discord-ready)";
	}
	const forumCatID = category.browseURL.split("/")[0];

	jsonArray.push({
		"title": category.name,
		"subtitle": category.description,
		"match": alfredMatcher (category.name),
		"arg": forumCatID,
		"mods": {
			"cmd": {
				"arg": url,
				"subtitle": "⌘: Open Forum Category",
			},
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy URL to Forum Category" + discordReady,
			},
		},
	});
});

JSON.stringify({ items: jsonArray });
