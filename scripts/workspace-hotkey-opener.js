#!/usr/bin/env osascript -l JavaScript

function run(argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	const workspaceName = argv.join("");
	if (!workspaceName) return;

	function getVaultNameEncoded() {
		const _app = Application.currentApplication();
		_app.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		const vaultPath = ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
		return encodeURIComponent(vaultPath.replace(/.*\//, ""));
	}
	const vaultNameEnc = getVaultNameEncoded();

	const workspaceLoadURI =
		"obsidian://advanced-uri?" +
		"vault=" + vaultNameEnc +
		"&workspace=" + encodeURIComponent(workspaceName);

	return workspaceLoadURI;
}
