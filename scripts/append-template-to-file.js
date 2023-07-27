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

/**
 * @param {string} text
 * @param {string} absPath
 */
function appendToFile(text, absPath) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	text = text.replaceAll("'", "`"); // ' in text string breaks echo writing method
	app.doShellScript(`echo '${text}' >> '${absPath}'`); // use single quotes to prevent running of input such as "$(rm -rf /)"
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

//───────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = getVaultPath();
	const relativePath = $.getenv("current_folder") + "/Untitled.md";
	const newFileAbsolutePath = `${vaultPath}/${relativePath}`;

	let newNoteContent = "";
	const templateRelPath = $.getenv("template_note_path") || "";
	if (templateRelPath) {
		let templateAbsPath = vaultPath + "/" + templateRelPath;
		if (!templateAbsPath.endsWith(".md")) templateAbsPath += ".md";
		newNoteContent = readFile(templateAbsPath)
	}

	appendToFile(newNoteContent, newFileAbsolutePath);

	delay(0.1); // ensure note is written
	// since there is a new note, rewrite the metadata. CAVEAT: Notes created not
	// by this workflow are not immediately written to the metadata
	app.openLocation(`obsidian://advanced-uri?vault=${getVaultNameEncoded()}&commandid=metadata-extractor%253Awrite-metadata-json`)

	return relativePath; // send to opening function
}
