#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function alfredMatcher(str) {
	const clean = str.replace(/[-()_.:#]/g, " ");
	const camelCaseSeperated = str.replace(/([A-Z])/g, " $1");
	return [clean, camelCaseSeperated, str].join(" ");
}

//──────────────────────────────────────────────────────────────────────────────

function getVaultPath() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault);
}
const vaultPath = getVaultPath()
const snippetPath = vaultPath + "/.obsidian/snippets/";

// Input
const snippetArr = app.doShellScript("find '" + snippetPath + "' -name '*.css' ").split("\r")
	.map(snippetFilePath => {
		const filename = snippetFilePath.replace(/.*\/(.*)\..+/, "$1");
		return {
			"title": filename,
			"match": alfredMatcher(filename),
			"arg": snippetFilePath,
			"subtitle": "snippet",
			"type": "file:skipcheck",
			"uid": snippetFilePath,
		};
	});

JSON.stringify({ "items": snippetArr });
