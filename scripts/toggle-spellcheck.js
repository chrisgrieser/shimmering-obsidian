#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	ObjC.import("Foundation");
	const app = Application.currentApplication();
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
	const workspaceName = decodeURIComponent(urlscheme.split("=")[2]);

	const workspaceToSpellcheck = $.getenv("workspace_to_spellcheck");

	// abort and do nothing when workspaces are managed, spellcheck toggled, or no spellcheck-workspace defined
	if (urlscheme.endsWith("workspaces%253Aopen-modal")) return;
	if (urlscheme.endsWith("editor%253Atoggle-spellcheck")) return;
	if (urlscheme.endsWith("saveworkspace=true")) return;
	if (workspaceToSpellcheck === "") return;

	// get current spellcheck status
	const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
	const turnSpellCheckOn = workspaceName === workspaceToSpellcheck;
	const currentSpellCheck = JSON.parse(readFile(vaultPath + "/.obsidian/app.json")).spellcheck;

	// toggle if change is needed
	if (turnSpellCheckOn !== currentSpellCheck) app.openLocation("obsidian://advanced-uri?vault=" + $.getenv("vault_name_ENC") + "&commandid=editor%253Atoggle-spellcheck");

}
