#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import('Foundation');
app = Application.currentApplication();
app.includeStandardAdditions = true;

function readFile (path, encoding) {
    if (!encoding) encoding = $.NSUTF8StringEncoding;
    const fm = $.NSFileManager.defaultManager;
    const data = fm.contentsAtPath(path);
    const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
    return ObjC.unwrap(str);
}


const vault_path = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const workspace_to_spellcheck = $.getenv("workspace_to_spellcheck");
const workspaceJSON = JSON.parse(readFile(vault_path + '/.obsidian/workspaces.json'));
const workspace_array = Object.keys(workspaceJSON.workspaces);
const currentWorkspace = workspaceJSON.active;

// get current spellcheck status
const currentSpellCheck = JSON.parse(readFile(vault_path + '/.obsidian/app.json')).spellcheck == "true";
let spellcheckStatus;
if (currentSpellCheck) spellcheckStatus = "ON";
else spellcheckStatus = "OFF";

let jsonArray = [];
workspace_array.forEach(workspaceName => {
	let workspaceLoad_URI = "obsidian://advanced-uri?workspace=" + encodeURIComponent(workspaceName);
	let workspaceSaveLoad_URI = workspaceLoad_URI + "&saveworkspace=true";

	// icons/emoji
	let spellcheckInfo = "";
	if (workspaceName == workspace_to_spellcheck) spellcheckInfo = "  🖍";
	let iconpath = "icons/workspace.png";
	if (workspaceName.toLowerCase().includes("writing")) iconpath = "icons/writing.png";
	if (workspaceName.toLowerCase().includes("write")) iconpath = "icons/writing.png";
	if (workspaceName.toLowerCase().includes("longform")) iconpath = "icons/writing.png";

	jsonArray.push({
		'title': workspaceName + spellcheckInfo,
		'match': workspaceName.replaceAll ("-", " ") + " " + workspaceName,
		'arg': workspaceLoad_URI,
		'uid': workspaceName,
		'icon': { 'path': iconpath },
		'mods': {
			'cmd': {
				'arg': workspaceSaveLoad_URI,
				'subtitle': "⌘: Save '" + currentWorkspace + "', then load",
			}
		},
	});
});

//Manage Workspaces
jsonArray.push({
	'title': "Manage Workspaces",
	'arg': "obsidian://advanced-uri?commandid=workspaces%253Aopen-modal",
	'icon': { 'path': 'icons/settings.png'},
	'uid': "manage-workspaces",
});

//Save Current Workspace
jsonArray.push({
	'title': "Save Current Workspace",
	'subtitle': currentWorkspace,
	'arg': "obsidian://advanced-uri?saveworkspace=true",
	'icon': { 'path': 'icons/save-workspace.png'},
	'uid': "save-workspace",
});

// Toggle Spellcheck
jsonArray.push({
	'title': "Toggle Spellcheck",
	'subtitle': "Currently: " + spellcheckStatus,
	'arg': "obsidian://advanced-uri?commandid=editor%253Atoggle-spellcheck",
	'icon': { 'path': 'icons/spellcheck.png'},
	'uid': "toggle-spellcheck",
});

JSON.stringify({ items: jsonArray });
