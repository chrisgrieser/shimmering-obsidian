#!/usr/bin/env osascript -l JavaScript
function run(argv) {
	function getVaultPath() {
		const theApp = Application.currentApplication();
		theApp.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
	}

	function appendToFile(text, absPath) {
		ObjC.import("stdlib");
		const app = Application.currentApplication();
		app.includeStandardAdditions = true;
		text = text.replaceAll("'", "`"); // ' in text string breaks echo writing method
		app.doShellScript(`echo '${text}' >> '${absPath}'`); // use single quotes to prevent running of input such as "$(rm -rf /)"
	}

	//───────────────────────────────────────────────────────────────────────────

	ObjC.import("stdlib");
	const content = $.getenv("prefix") + argv[0];
	const absolutePath = getVaultPath() + "/" + $.getenv("relative_path");
	appendToFile(content, absolutePath);
}
