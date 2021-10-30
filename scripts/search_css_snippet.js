#!/usr/bin/env osascript -l JavaScript
ObjC.import('stdlib');
app = Application.currentApplication();
app.includeStandardAdditions = true;

const homepath = app.pathTo('home folder');
const vault_path = $.getenv('vault_path').replace(/^~/, homepath);
const snippet_path = vault_path + "/.obsidian/snippets/";
const theme_path = vault_path + "/.obsidian/themes/";
const current_theme = app.doShellScript('cat "' + vault_path + '/.obsidian/appearance.json' +'" | grep "cssTheme" | head -n 1 | cut -d ' + "'" + '"' + "'" + ' -f 4');

// Input
let snippet_arr = app.doShellScript("find '" + snippet_path + "' -name '*.css' ").split("\r");
let theme_arr = app.doShellScript("find '" + theme_path + "' -name '*.css' ").split("\r");

//JSON Construction
let jsonArray = [];
theme_arr.forEach(themePath => {
	filename = themePath.replace(/.*\/(.*)\..+/,"$1");
	let current_icon = "";
	let subtitle_prefix = "";
	if (current_theme == filename){
		current_icon = "✅ ";
		subtitle_prefix = "current "
	}
	jsonArray.push ({
		'title': current_icon + filename,
		'arg': themePath,
		'subtitle': subtitle_prefix + "theme",
		'type':'file:skipcheck',
		'uid': themePath,
	})
});
snippet_arr.forEach(snippetPath => {
	filename = snippetPath.replace(/.*\/(.*)\..+/,"$1");
	jsonArray.push ({
		'title': filename,
		'arg': snippetPath,
		'subtitle': "snippet",
		'type':'file:skipcheck',
		'uid': snippetPath,
	})
});

JSON.stringify({ 'items': jsonArray });

