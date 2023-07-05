#!/usr/bin/env osascript -l JavaScript

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

function getVaultNameEncoded() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const theVaultPath = ObjC.unwrap(vault)
	const vaultName = theVaultPath.replace(/.*\//, "")
	return encodeURIComponent(vaultName);
}
const vaultNameEnc = getVaultNameEncoded();
function getVaultPath() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
}

const vaultPath = getVaultPath();
const workspaceToSpellcheck = $.getenv("workspace_to_spellcheck");
const workspaceJSON = JSON.parse(readFile(vaultPath + "/.obsidian/workspaces.json"));
const workspaceArray = Object.keys(workspaceJSON.workspaces);
const currentWorkspace = workspaceJSON.active;

// get current spellcheck status
const currentSpellCheck = JSON.parse(readFile(vaultPath + "/.obsidian/app.json")).spellcheck;
let spellcheckStatus;
if (currentSpellCheck === true) spellcheckStatus = "Disable";
else spellcheckStatus = "Enable";

const jsonArray = [];
workspaceArray.forEach(workspaceName => {
	const workspaceLoadURI =
		"obsidian://advanced-uri?vault=" + vaultNameEnc + "&workspace=" + encodeURIComponent(workspaceName);
	const workspaceSaveLoadURI = workspaceLoadURI + "&saveworkspace=true";

	// icons/emoji
	let spellcheckInfo = "";
	if (workspaceName === workspaceToSpellcheck) spellcheckInfo = "  🖍";
	let iconpath = "icons/workspace.png";
	if (workspaceName.toLowerCase().includes("writing")) iconpath = "icons/writing.png";
	if (workspaceName.toLowerCase().includes("write")) iconpath = "icons/writing.png";
	if (workspaceName.toLowerCase().includes("longform")) iconpath = "icons/writing.png";

	jsonArray.push({
		title: 'Load "' + workspaceName + '"' + spellcheckInfo,
		match: workspaceName.replaceAll("-", " ") + " " + workspaceName,
		arg: workspaceLoadURI,
		uid: workspaceName,
		icon: { path: iconpath },
	});
});

// Save Current Workspace
jsonArray.push({
	title: 'Save "' + currentWorkspace + '"',
	arg: "obsidian://advanced-uri?vault=" + vaultNameEnc + "&saveworkspace=true",
	icon: { path: "icons/save-workspace.png" },
	uid: "save-workspace",
});

// Manage Workspaces (no UID to ensure it is on bottom)
jsonArray.push({
	title: "Manage Workspaces",
	arg: "obsidian://advanced-uri?vault=" + vaultNameEnc + "&commandid=workspaces%253Aopen-modal",
	icon: { path: "icons/settings.png" },
});

// Toggle Spellcheck (no UID to ensure it is on bottom)
jsonArray.push({
	title: spellcheckStatus + " Spellcheck",
	arg: "obsidian://advanced-uri?vault=" + vaultNameEnc + "&commandid=editor%253Atoggle-spellcheck",
	icon: { path: "icons/spellcheck.png" },
});

JSON.stringify({ items: jsonArray });
