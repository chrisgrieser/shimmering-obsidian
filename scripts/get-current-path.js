#!/usr/bin/env osascript -l JavaScript

function run () {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	const vaultNameEnc = $.getenv("vault_name_ENC");

	app.openLocation(`obsidian://advanced-uri?${vaultNameEnc}&commandid=workspace%253Acopy-path`);
	delay(0.1);
	const activeFile = app.theClipboard();
	return activeFile;
}
