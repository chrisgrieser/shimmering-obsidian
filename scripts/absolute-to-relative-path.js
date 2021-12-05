#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));

	const absolutePath = argv.join("");
	const relativePath = absolutePath.slice (vaultPath.length);

	return relativePath;
}
