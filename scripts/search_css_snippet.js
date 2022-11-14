#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

const homepath = app.pathTo("home folder");
const vaultPath = $.getenv("vault_path").replace(/^~/, homepath);
const snippetPath = vaultPath + "/.obsidian/snippets/";

// Input
const snippetArr = app.doShellScript("find '" + snippetPath + "' -name '*.css' ").split("\r")
	.map(snippetFilePath => {
		const filename = snippetFilePath.replace(/.*\/(.*)\..+/, "$1");
		return {
			"title": filename,
			"arg": snippetFilePath,
			"subtitle": "snippet",
			"type": "file:skipcheck",
			"uid": snippetFilePath,
		};
	});

JSON.stringify({ "items": snippetArr });
