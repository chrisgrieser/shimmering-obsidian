#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}
/**
 * @param {string} text
 * @param {string} file
 */
function writeToFile(text, file) {
	const str = $.NSString.alloc.initWithUTF8String(text);
	str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
}

/**
 * @param {string} envVar
 * @param {string} newValue
 */
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
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath(
		$.getenv("alfred_workflow_data") + "/vaultPath",
	);
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
}

function getVaultNameEncoded() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath(
		$.getenv("alfred_workflow_data") + "/vaultPath",
	);
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const theVaultPath = ObjC.unwrap(vault);
	const vaultName = theVaultPath.replace(/.*\//, "");
	return encodeURIComponent(vaultName);
}

const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

//───────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	let selectedText; // when hotkey was used
	try {
		selectedText = $.getenv("selected_text");
	} catch (_error) {
		selectedText = "";
	}

	let createInNewTab;
	try {
		createInNewTab = $.getenv("create_in_new_tab") === "true";
	} catch (_error) {
		createInNewTab = false;
	}
	if (createInNewTab)
		app.openLocation(
			`obsidian://advanced-uri?vault=${getVaultNameEncoded()}&commandid=workspace%253Anew-tab`,
		);

	//───────────────────────────────────────────────────────────────────────────

	let fileName = argv.join("") || "Untitled";
	fileName = fileName.replace(/[\\/:]/g, ""); // remove illegal characters
	fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1); // capitalize

	const templateRelPath = $.getenv("template_note_path") || "";
	const newNoteLocation = $.getenv("new_note_location") || "";
	const newNoteRelPath = `${newNoteLocation}/${fileName}.md`;
	let newNoteAbsPath = getVaultPath() + "/" + newNoteRelPath;
	if (fileExists(newNoteAbsPath)) newNoteAbsPath += " 1";

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
