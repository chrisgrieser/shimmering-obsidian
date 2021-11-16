#!/usr/bin/env osascript -l JavaScript

function run (argv){
	ObjC.import('stdlib');
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

	// get target spellcheck status
	const urlscheme = argv.join("");
	const workspaceName = decodeURIComponent(urlscheme.split("=")[1]);
	const workspace_to_spellcheck = $.getenv("workspace_to_spellcheck");

	// abort and do nothing when workspaces are managed, spellcheck toggled
	// or no spellcheck-workspace defined
	if (urlscheme == "obsidian://advanced-uri?commandid=workspaces%253Aopen-modal") return;
	if (urlscheme == "obsidian://advanced-uri?commandid=editor%253Atoggle-spellcheck") return;
	if (urlscheme == "obsidian://advanced-uri?saveworkspace=true") return;
	if (workspace_to_spellcheck == "") return;

	// get current spellcheck status
	const vault_path = $.getenv("vault_path").replace(/^~/, app.pathTo('home folder'));
	const turnSpellCheckOn = (workspaceName == workspace_to_spellcheck);
	const currentSpellCheck = JSON.parse(readFile(vault_path + '/.obsidian/app.json')).spellcheck == "true";


	// toggle if change is needed
	if (turnSpellCheckOn != currentSpellCheck) {
		app.openLocation("obsidian://advanced-uri?commandid=editor%253Atoggle-spellcheck");
	}
}
