#!/usr/bin/env osascript -l JavaScript
function getVaultPath() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault);
}

function appendToFile(text, absPath) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	text = text.replaceAll("'", "`"); // ' in text string breaks echo writing method
	app.doShellScript(`echo '${text}' >> '${absPath}'`); // use single quotes to prevent running of input such as "$(rm -rf /)"
}

function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

//───────────────────────────────────────────────────────────────────────────
const vaultPath = getVaultPath();
const templateContent = readFile(vaultPath + "/" + $.getenv("template_note_path"));
const newFileAbsolutePath = vaultPath + "/" + $.getenv("current_folder") + "/Untitled.md";
appendToFile(templateContent, newFileAbsolutePath);
