#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const vaultNameEnc = encodeURIComponent(vaultPath.replace(/.*\//, ""));

	app.openLocation(
		`obsidian://advanced-uri?vault=${vaultNameEnc}&commandid=obsidian42-brat%253ABRAT-checkForUpdatesAndUpdate`,
	);
	app.openLocation(`obsidian://advanced-uri?vault=${vaultNameEnc}&updateplugins=true`);
}
