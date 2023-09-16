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

//───────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	// get target spellcheck status
	const workspaceName = argv[0];
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");
	const vaultNameEnc = encodeURIComponent(vaultPath.replace(/.*\//, ""));

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
	const currentSpellCheck = JSON.parse(readFile(`${vaultPath}/${configFolder}/app.json`)).spellcheck;
	if (turnSpellCheckOn !== currentSpellCheck)
		app.openLocation(`obsidian://advanced-uri?vault=${vaultNameEnc}&commandid=editor%253Atoggle-spellcheck`);
}
