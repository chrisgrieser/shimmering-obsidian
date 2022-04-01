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

	let fileName = argv.join("");
	if (!fileName) fileName = "Untitled";
	fileName = fileName
		.replace (/[\\/:]/g, "") // remove illegal charcters
		.charAt(0).toUpperCase() + fileName.slice(1); // capitalize

	const newNotePath = ($.getenv("new_note_location") + "/" + fileName)
		.replaceAll ("//", "/");

	let URI = "obsidian://new?" +
			"vault=" + $.getenv("vault_name_ENC") +
			"&file=" + encodeURIComponent(newNotePath);

	// Template
	const templateRelPath = $.getenv("template_note_path");
	if (templateRelPath) {
		let templateAbsPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"))
			+ "/" + templateRelPath;
		if (!templateAbsPath.endsWith(".md")) templateAbsPath += ".md";
		const newNoteContent = readFile(templateAbsPath);
		URI += "&content=" + encodeURIComponent(newNoteContent);
		console.log("absolute template path:" + templateAbsPath);
	}

	console.log("URI: " + URI);

	app.openLocation(URI); // also opens the note
}
