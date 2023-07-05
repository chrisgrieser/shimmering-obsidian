#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib")

function run(argv) {
	function getVaultPath() {
		const theApp = Application.currentApplication();
		theApp.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
	}

	const absolutePath = argv.join("");
	const relativePath = absolutePath.slice(getVaultPath().length);
	return relativePath;
}
