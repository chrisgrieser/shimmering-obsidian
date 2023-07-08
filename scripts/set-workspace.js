#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
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
const vaultPath = getVaultPath();
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
function run(argv) {
	// get target spellcheck status
	const workspaceName = argv[0];
	const vaultNameEnc = getVaultNameEncoded();

	if (workspaceName === "_save-workspace") {
		app.openLocation(`obsidian://advanced-uri?vault=${vaultNameEnc}&saveworkspace=true`);
		return;
	} else if (workspaceName === "_manage-workspace") {
		app.openLocation(`obsidian://advanced-uri?vault=${vaultNameEnc}&commandid=workspaces%253Aopen-modal`);
		return;
	}

	const workspaceLoadURI = `obsidian://advanced-uri?vault=${vaultNameEnc}&workspace=${encodeURIComponent(
		workspaceName,
	)}`;
	app.openLocation(workspaceLoadURI);

	// TOGGLE SPELLCHECK
	const workspacesToSpellcheck = $.getenv("workspace_to_spellcheck").split(/, ?/);
	const turnSpellCheckOn = workspacesToSpellcheck.includes(workspaceName);
	const currentSpellCheck = JSON.parse(readFile(vaultPath + "/.obsidian/app.json")).spellcheck;
	if (turnSpellCheckOn !== currentSpellCheck)
		app.openLocation(
			"obsidian://advanced-uri?vault=" + getVaultNameEncoded() + "&commandid=editor%253Atoggle-spellcheck",
		);
}
