#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");

var vault_path = $.getenv("vault_path").replace(/^~/, homepath);

var workspace_array = app.doShellScript(
    'grep "main" -B1 "' + vault_path + '/.obsidian/workspaces.json"'
    + '| grep -vE "\\-\\-|main" | cut -d ' + "'" + '"' + "'" + ' -f2'
).split("\r");


let jsonArray = [];
workspace_array.forEach(workspace => {
	let alfredMatcher = workspace.replaceAll ("-", " ");
	let workspace_URI = "obsidian://advanced-uri?workspace=" + encodeURIComponent(workspace);
	jsonArray.push({
		'title': workspace,
		'match': alfredMatcher + " " + workspace,
		'arg': workspace_URI,
		'uid': workspace,
	});
});

JSON.stringify({ items: jsonArray });
