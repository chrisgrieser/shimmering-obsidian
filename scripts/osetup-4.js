#!/usr/bin/env osascript -l JavaScript

function run () {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const getEnv = (vari) => $.getenv(vari).replace(/^~/, app.pathTo("home folder"));
	// -----------

	const numberOfJSONS = app.doShellScript("ls '" + getEnv("vault_path") + "/.obsidian/plugins/metadata-extractor/' | grep \".json\" | grep -v \"manifest\" | grep -v \"^data\" | wc -l | tr -d \" \"");
	if (numberOfJSONS < 4) return "⚠️ Metadata wasn't written properly.;;Run `oupdate` ➞ `Manually Refresh Metadata` to complete setup.";
	return "🥳 Workflow Setup complete";
}
