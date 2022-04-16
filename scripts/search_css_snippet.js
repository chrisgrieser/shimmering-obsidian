#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

const homepath = app.pathTo("home folder");
const vaultPath = $.getenv("vault_path").replace(/^~/, homepath);
const snippetPath = vaultPath + "/.obsidian/snippets/";
const themePath = vaultPath + "/.obsidian/themes/";
const currentTheme = app.doShellScript(`cat "${vaultPath}/.obsidian/appearance.json" | grep "cssTheme" | head -n 1 | cut -d '"' -f 4`);

// Input
const snippetArr = app.doShellScript("find '" + snippetPath + "' -name '*.css' ").split("\r");
const themeArr = app.doShellScript("find '" + themePath + "' -name '*.css' ").split("\r");

// JSON Construction
const jsonArray = [];
themeArr.forEach(themeFilePath => {
	const filename = themeFilePath.replace(/.*\/(.*)\..+/, "$1");
	let currentIcon = "";
	let subtitlePrefix = "";
	if (currentTheme === filename) {
		currentIcon = "✅ ";
		subtitlePrefix = "current ";
	}
	jsonArray.push ({
		"title": currentIcon + filename,
		"arg": themeFilePath,
		"subtitle": subtitlePrefix + "theme",
		"type":"file:skipcheck",
		"uid": themeFilePath,
	});
});
snippetArr.forEach(snippetFilePath => {
	const filename = snippetFilePath.replace(/.*\/(.*)\..+/, "$1");
	jsonArray.push ({
		"title": filename,
		"arg": snippetFilePath,
		"subtitle": "snippet",
		"type":"file:skipcheck",
		"uid": snippetFilePath,
	});
});

JSON.stringify({ "items": jsonArray });

