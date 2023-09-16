#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const absolutePath = argv[0];
	const vaultPath = $.getenv("vault_path");
	const relativePath = absolutePath.slice(vaultPath.length);
	return relativePath;
}
