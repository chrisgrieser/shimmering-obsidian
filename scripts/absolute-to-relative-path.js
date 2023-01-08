#!/usr/bin/env osascript -l JavaScript

function run(argv) {
	function getVaultPath() {
		const _app = Application.currentApplication();
		_app.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		return ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
	}

	const absolutePath = argv.join("");
	const relativePath = absolutePath.slice(getVaultPath().length);
	return relativePath;
}
