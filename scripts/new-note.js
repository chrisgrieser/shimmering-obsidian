#!/usr/bin/env osascript -l JavaScript

function run (argv) {
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

	const newNotePath = $.getenv("new_note_location").replace(/^\/|\/$/, "");
	const fileName = argv.join("");
	const vaultNameEnc = $.getenv("vault_name_ENC");
	const content = readFile($.getenv("vault_path").replace(/^~/, app.pathTo("home folder")) +  "/" + $.getenv("template_note_path"));

	const URI = "obsidian://new?vault=" + vaultNameEnc +
		"&file=" + encodeURIComponent(newNotePath + "/" + fileName) +
		"&content=" + encodeURIComponent(content);

	app.openLocation(URI);

	// pass for opening
	const relativePath = newNotePath + "/" + fileName + ".md";
	return relativePath;
}
