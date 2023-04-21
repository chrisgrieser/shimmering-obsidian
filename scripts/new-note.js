#!/usr/bin/env osascript -l JavaScript

function run(argv) {
	ObjC.import("stdlib");
	ObjC.import("Foundation");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	function readFile(path) {
		const data = $.NSFileManager.defaultManager.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
		return ObjC.unwrap(str);
	}
	function writeToFile(text, file) {
		const str = $.NSString.alloc.initWithUTF8String(text);
		str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
	}

	function setEnvVar(envVar, newValue) {
		Application("com.runningwithcrayons.Alfred").setConfiguration(envVar, {
			toValue: newValue,
			inWorkflow: $.getenv("alfred_workflow_bundleid"),
			exportable: false,
		});
	}

	function getVaultPath() {
		const theApp = Application.currentApplication();
		theApp.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
	}
	function getVaultNameEncoded() {
		const theApp = Application.currentApplication();
		theApp.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		const theVaultPath = ObjC.unwrap(vault);
		const vaultName = theVaultPath.replace(/.*\//, "");
		return encodeURIComponent(vaultName);
	}

	//───────────────────────────────────────────────────────────────────────────

	let selectedText; // when hotkey was used
	try {
		selectedText = $.getenv("selected_text");
	} catch (error) {
		selectedText = "";
	}

	let createInNewTab;
	try {
		createInNewTab = $.getenv("create_in_new_tab") === "true";
	} catch (error) {
		createInNewTab = false;
	}
	if (createInNewTab)
		app.openLocation(`obsidian://advanced-uri?vault=${getVaultNameEncoded()}&commandid=workspace%253Anew-tab`);

	//───────────────────────────────────────────────────────────────────────────

	let fileName = argv.join("") || "Untitled";
	fileName = fileName.replace(/[\\/:]/g, ""); // remove illegal characters
	fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1); // capitalize

	const templateRelPath = $.getenv("template_note_path") || "";
	const newNoteLocation = $.getenv("new_note_location") || "";
	const newNoteRelPath = `${newNoteLocation}/${fileName}.md`;
	const newNoteAbsPath = getVaultPath() + "/" + newNoteRelPath;

	let newNoteContent;
	if (selectedText) {
		newNoteContent = selectedText;
	} else if (templateRelPath) {
		let templateAbsPath = getVaultPath() + "/" + templateRelPath;
		if (!templateAbsPath.endsWith(".md")) templateAbsPath += ".md";
		newNoteContent = readFile(templateAbsPath).replace("{{title}}", fileName); // insert title
	} else {
		newNoteContent = "";
	}

	writeToFile(newNoteContent, newNoteAbsPath);

	// reset
	setEnvVar("create_in_new_tab", "");
	setEnvVar("selected_text", "");

	return newNoteRelPath; // pass to opening function
}
