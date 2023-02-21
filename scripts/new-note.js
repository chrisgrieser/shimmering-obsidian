#!/usr/bin/env osascript -l JavaScript

function run(argv) {
	ObjC.import("stdlib");
	ObjC.import("Foundation");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	function readFile(path, encoding) {
		if (!encoding) encoding = $.NSUTF8StringEncoding;
		const fm = $.NSFileManager.defaultManager;
		const data = fm.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
		return ObjC.unwrap(str);
	}

	function setEnvVar(envVar, newValue) {
		Application("com.runningwithcrayons.Alfred").setConfiguration(envVar, {
			toValue: newValue,
			inWorkflow: $.getenv("alfred_workflow_bundleid"),
			exportable: false,
		});
	}

	function getVaultPath() {
		const _app = Application.currentApplication();
		_app.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		return ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
	}
	function getVaultNameEncoded() {
		const _app = Application.currentApplication();
		_app.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		const vaultPath = ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
		return encodeURIComponent(vaultPath.replace(/.*\//, ""));
	}
	const vaultNameEnc = getVaultNameEncoded();
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
		app.openLocation(`obsidian://advanced-uri?vault=${vaultNameEnc}&commandid=workspace%253Anew-tab`);

	let fileName = argv.join("");
	if (!fileName) fileName = "Untitled";
	fileName = fileName.replace(/[\\/:]/g, ""); // remove illegal characters
	fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1); // eslint-disable-line newline-per-chained-call

	//───────────────────────────────────────────────────────────────────────────

	const newNotePath = ($.getenv("new_note_location") + "/" + fileName).replaceAll("//", "/");

	let URI =
		"obsidian://advanced-uri?" +
		"vault=" +
		vaultNameEnc +
		"&filepath=" +
		encodeURIComponent(newNotePath) +
		"&mode=new" +
		"&line=999999999999999"; // = append at end of file

	// Content
	let newNoteContent = "";
	const templateRelPath = $.getenv("template_note_path");
	if (templateRelPath) {
		let templateAbsPath = getVaultPath() + "/" + templateRelPath;
		if (!templateAbsPath.endsWith(".md")) templateAbsPath += ".md";
		newNoteContent += readFile(templateAbsPath).replace("{{title}}", fileName);
		console.log("absolute template path:" + templateAbsPath);
	}

	if (selectedText) newNoteContent += selectedText;
	console.log("newNoteContent:", newNoteContent);

	URI += "&data=" + encodeURIComponent(newNoteContent);
	console.log("URI: " + URI);
	app.openLocation(URI);

	// reset
	setEnvVar("create_in_new_tab", "");
	setEnvVar("selected_text", "");
}
