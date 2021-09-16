#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");

var vault_path = $.getenv("vault_path").replace(/^~/, homepath);

var workspace_array = app.doShellScript(
    'grep "main" -B1 "' + vault_path + '/.obsidian/workspaces.json"'
    + ' | cut -d ' + "'" + '"' + "'" + ' -f2'
).split("\r--\r");

let jsonArray = [];
workspace_array.forEach(workspace => {
	let workspace_name = workspace.split("\r")[0];
	let alfredMatcher = workspace_name.replaceAll ("-", " ");
	let workspace_URI = "obsidian://advanced-uri?workspace=" + encodeURIComponent(workspace_name);
	jsonArray.push({
		'title': workspace_name,
		'match': alfredMatcher + " " + workspace_name,
		'arg': workspace_URI,
		'uid': workspace_name,
	});
});

JSON.stringify({ items: jsonArray });
