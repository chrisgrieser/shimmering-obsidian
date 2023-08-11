#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const vaultNameEnc = encodeURIComponent(vaultPath.replace(/.*\//, ""));

	app.openLocation(`obsidian://advanced-uri?${vaultNameEnc}&commandid=workspace%253Acopy-path`);
	delay(0.1);
	const activeFile = app.theClipboard();
	return activeFile;
}
