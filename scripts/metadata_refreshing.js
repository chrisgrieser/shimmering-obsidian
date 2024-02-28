#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const vaultNameEnc = encodeURIComponent(vaultPath.replace(/.*\//, ""));

	const prefix = `obsidian://advanced-uri?vault=${vaultNameEnc}&commandid=metadata-extractor%253A`;
	// biome-ignore format: multi-line better when when there are changes
	const files = [
		"write-metadata-json",
		"write-tags-json",
		"write-allExceptMd-json",
		"write-canvas-json",
	];
	for (const file of files) {
		app.openLocation(prefix + file);
		delay(0.5);
	}
	// Refresh caches fro Alfred 5
	Application("com.runningwithcrayons.Alfred").reloadWorkflow(
		$.getenv("alfred_workflow_bundleid"),
	);
}
