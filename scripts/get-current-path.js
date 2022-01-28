#!/usr/bin/env osascript -l JavaScript

function run () {
	ObjC.import("stdlib");
	ObjC.import("Foundation");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	function readFile (path, encoding) {
		if (!encoding) encoding = $.NSUTF8StringEncoding;
		const fm = $.NSFileManager.defaultManager;
		const data = fm.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
		return ObjC.unwrap(str);
	}

	const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
	const activeFile = JSON.parse(readFile(vaultPath + "/.obsidian/workspace"))
		.lastOpenFiles[0];

	return activeFile;
}
