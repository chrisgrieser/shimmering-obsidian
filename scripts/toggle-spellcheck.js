#!/usr/bin/env osascript -l JavaScript

function run (argv){
	ObjC.import('stdlib');
	app = Application.currentApplication();
	app.includeStandardAdditions = true;

	// get target spellcheck status
	const urlscheme = argv.join("");
	const workspaceName = decodeURIComponent(urlscheme.split("=")[1]);
	const workspace_to_spellcheck = $.getenv("workspace_to_spellcheck");
	const turnSpellCheckOn = (workspaceName == workspace_to_spellcheck);

	// get current spellcheck status
	const homepath = app.pathTo('home folder');
	const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
	const currentSpellCheck = app.doShellScript(
		'grep "\\"spellcheck\\":" "' +  vault_path + '/.obsidian/app.json'
		+ '"  | cut -d: -f2 | tr -d " ,"'
	) == "true";

	// abort and do nothing when workspaces are managed, spellcheck toggled
	// or no spellcheck-workspace defined
	if (urlscheme == "obsidian://advanced-uri?commandid=workspaces%253Aopen-modal") return;
	if (urlscheme == "obsidian://advanced-uri?commandid=editor%253Atoggle-spellcheck") return;
	if (workspace_to_spellcheck == "") return;

	// toggle if change is needed
	if (turnSpellCheckOn != currentSpellCheck) {
		app.openLocation("obsidian://advanced-uri?commandid=editor%253Atoggle-spellcheck");
	}
}
