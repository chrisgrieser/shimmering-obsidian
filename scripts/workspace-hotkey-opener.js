#!/usr/bin/env osascript -l JavaScript

function run(argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	const workspaceName = argv.join("");
	if (!workspaceName) return;
	const vaultNameEnc = $.getenv("vault_name_ENC");

	const workspaceLoadURI =
		"obsidian://advanced-uri?" +
		"vault=" + vaultNameEnc +
		"&workspace=" + encodeURIComponent(workspaceName);

	return workspaceLoadURI;
}
