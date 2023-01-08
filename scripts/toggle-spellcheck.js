#!/usr/bin/env osascript -l JavaScript

function run(argv) {
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
	function getVaultPath() {
		const _app = Application.currentApplication();
		_app.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		return ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
	}
	const vaultPath = getVaultPath();
	function getVaultNameEncoded() {
		const _app = Application.currentApplication();
		_app.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		const _vaultPath = ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
		return encodeURIComponent(_vaultPath.replace(/.*\//, ""));
	}
	//───────────────────────────────────────────────────────────────────────────

	// get target spellcheck status
	const urlscheme = argv.join("");

	const workspaceName = decodeURIComponent(urlscheme.split("=")[2]);

	if ($.getenv("spellcheck-workspace") === "") return;

	const workspacesToSpellcheck = $.getenv("workspace_to_spellcheck").split(/, ?/);
	console.log("workspacesToSpellcheck: " + workspacesToSpellcheck);

	// abort and do nothing when workspaces are managed, spellcheck toggled, or no spellcheck-workspace defined
	if (urlscheme.endsWith("workspaces%253Aopen-modal")) return;
	if (urlscheme.endsWith("editor%253Atoggle-spellcheck")) return;
	if (urlscheme.endsWith("saveworkspace=true")) return;

	// get current spellcheck status
	const turnSpellCheckOn = workspacesToSpellcheck.includes(workspaceName);
	const currentSpellCheck = JSON.parse(readFile(vaultPath + "/.obsidian/app.json")).spellcheck;

	// toggle if change is needed
	if (turnSpellCheckOn !== currentSpellCheck)
		app.openLocation(
			"obsidian://advanced-uri?vault=" + getVaultNameEncoded() + "&commandid=editor%253Atoggle-spellcheck",
		);
}
