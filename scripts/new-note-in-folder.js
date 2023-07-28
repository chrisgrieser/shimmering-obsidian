#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function getVaultPath() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath(
		$.getenv("alfred_workflow_data") + "/vaultPath",
	);
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
}

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
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

/** @param {string} filepath @param {string} text */
function writeToFile(filepath, text) {
	const str = $.NSString.alloc.initWithUTF8String(text);
	str.writeToFileAtomicallyEncodingError(filepath, true, $.NSUTF8StringEncoding, null);
}

const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

//───────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = getVaultPath();
	const relativePath = $.getenv("current_folder") + "/Untitled.md";
	let newNoteAbsPath = `${vaultPath}/${relativePath}`;

	let newNoteContent = "";
	const templateRelPath = $.getenv("template_note_path") || "";
	if (templateRelPath) {
		let templateAbsPath = vaultPath + "/" + templateRelPath;
		if (!templateAbsPath.endsWith(".md")) templateAbsPath += ".md";
		newNoteContent = readFile(templateAbsPath)
	}
	while (fileExists(newNoteAbsPath)) {
		newNoteAbsPath = newNoteAbsPath.slice(0, -3) + " 1.md";
	}
	writeToFile(newNoteContent, newNoteAbsPath);

	delay(0.1); // ensure note is written
	// since there is a new note, rewrite the metadata. CAVEAT: Notes created not
	// by this workflow are not immediately written to the metadata
	app.openLocation(`obsidian://advanced-uri?vault=${getVaultNameEncoded()}&commandid=metadata-extractor%253Awrite-metadata-json`)

	return relativePath; // send to opening function
}
