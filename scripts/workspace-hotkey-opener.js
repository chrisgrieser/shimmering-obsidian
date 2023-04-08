#!/usr/bin/env osascript -l JavaScript

function run(argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	const workspaceName = argv.join("");
	if (!workspaceName) return "";

	function getVaultNameEncoded() {
		const theApp = Application.currentApplication();
		theApp.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		const theVaultPath = ObjC.unwrap(vault);
		const vaultName = theVaultPath.replace(/.*\//, "");
		return encodeURIComponent(vaultName);
	}
	const vaultNameEnc = getVaultNameEncoded();

	const workspaceLoadURI =
		`obsidian://advanced-uri?vault=${vaultNameEnc}&workspace=${encodeURIComponent(workspaceName)}`;

	return workspaceLoadURI;
}
