#!/usr/bin/env osascript -l JavaScript

function run() {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

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

	app.openLocation(`obsidian://advanced-uri?${vaultNameEnc}&commandid=workspace%253Acopy-path`);
	delay(0.1);
	const activeFile = app.theClipboard();
	return activeFile;
}
