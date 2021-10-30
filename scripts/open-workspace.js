#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");

const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const workspace_to_spellcheck = $.getenv("workspace_to_spellcheck");

var workspace_array = app.doShellScript(
    'grep "main" -B1 "' + vault_path + '/.obsidian/workspaces.json"'
    + ' | cut -d ' + "'" + '"' + "'" + ' -f2'
).split("\r--\r");


// get current spellcheck status
const currentSpellCheck = app.doShellScript(
	'grep "\\"spellcheck\\":" "' +  vault_path + '/.obsidian/app.json'
	+ '"  | cut -d: -f2 | tr -d " ,"'
);
let spellcheckStatus = "off";
if (currentSpellCheck == "true") spellcheckStatus = "on";

let jsonArray = [];
workspace_array.forEach(workspace => {
	let workspace_name = workspace.split("\r")[0];
	let alfredMatcher = workspace_name.replaceAll ("-", " ");
	let workspace_URI = "obsidian://advanced-uri?workspace=" + encodeURIComponent(workspace_name);

	// icons/emoji
	let spellcheckInfo = "";
	let iconpath = "icons/workspace.png";
	if (workspace_name == workspace_to_spellcheck) spellcheckInfo = "  🖍";
	if (workspace_name.toLowerCase().includes("writing")) iconpath = "icons/writing.png";
	if (workspace_name.toLowerCase().includes("longform")) iconpath = "icons/writing.png";
	if (workspace_name.toLowerCase().includes("kanban")) iconpath = "icons/kanban.png";

	jsonArray.push({
		'title': workspace_name + spellcheckInfo,
		'match': alfredMatcher + " " + workspace_name,
		'arg': workspace_URI,
		'uid': workspace_name,
		'icon': { 'path': iconpath },
	});
});


//Manage Workspaces
jsonArray.push({
	'title': "Manage Workspaces",
	'arg': "obsidian://advanced-uri?commandid=workspaces%253Aopen-modal",
	'icon': { 'path': 'icons/settings.png'},
	'uid': "manage-workspaces",
});

// Toggle Spellcheck
jsonArray.push({
	'title': "Toggle Spellcheck",
	'subtitle': "currently: " + spellcheckStatus,
	'arg': "obsidian://advanced-uri?commandid=editor%253Atoggle-spellcheck",
	'icon': { 'path': 'icons/spellcheck.png'},
	'uid': "toggle-spellcheck",
});

JSON.stringify({ items: jsonArray });
