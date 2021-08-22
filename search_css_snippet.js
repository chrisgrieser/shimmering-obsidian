#!/usr/bin/env osascript -l JavaScript
ObjC.import('stdlib');
app = Application.currentApplication();
app.includeStandardAdditions = true;

var vault_path = $.getenv('vault_path');
let homepath = app.pathTo('home folder');
vault_path = vault_path.replace(/^~/, homepath);
const snippet_path = vault_path + "/.obsidian/snippets/";

// Input
let snippets = app.doShellScript("find '" + snippet_path + "' -name '*.css' ");
var snippet_array = snippets.split ("\r");

//JSON Construction
let jsonArray = [];
snippet_array.forEach(snippet => {
	filename = snippet.replace(/.*\//,"");
	jsonArray.push ({
		'title': filename,
		'arg': snippet,
		'type':'file:skipcheck',
		'uid': snippet,
	})
});

JSON.stringify({ 'items': jsonArray });

