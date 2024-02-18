#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	// get target spellcheck status
	const workspaceName = argv[0];
	const vaultPath = $.getenv("vault_path");
	const vaultNameEnc = encodeURIComponent(vaultPath.replace(/.*\//, ""));

	if (workspaceName === "_save-workspace") {
		app.openLocation(`obsidian://advanced-uri?vault=${vaultNameEnc}&saveworkspace=true`);
		return;
	}
	if (workspaceName === "_manage-workspace") {
		app.openLocation(
			`obsidian://advanced-uri?vault=${vaultNameEnc}&commandid=workspaces%253Aopen-modal`,
		);
		return;
	}

	const workspaceLoadURI = `obsidian://advanced-uri?vault=${vaultNameEnc}&workspace=${encodeURIComponent(
		workspaceName,
	)}`;
	app.openLocation(workspaceLoadURI);
}
