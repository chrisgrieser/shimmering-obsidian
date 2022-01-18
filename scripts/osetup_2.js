#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	ObjC.import("Foundation");
	function readFile (path, encoding) {
		if (!encoding) encoding = $.NSUTF8StringEncoding;
		const fm = $.NSFileManager.defaultManager;
		const data = fm.contentsAtPath(path);
		const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
		return ObjC.unwrap(str);
	}
	
	const vaultPath = argv.join("");
	const vaultName = vaultPath.split("/").pop();

	Application("com.runningwithcrayons.Alfred").setConfiguration ("vault_path", {
		toValue: vaultPath.replace(/\/Users\/[^/]*/, "~"),
		inWorkflow: $.getenv("alfred_workflow_bundleid"),
		exportable: false
	});

	Application("com.runningwithcrayons.Alfred").setConfiguration ("vault_name_ENC", {
		toValue: encodeURIComponent(vaultName),
		inWorkflow: $.getenv("alfred_workflow_bundleid"),
		exportable: false
	});

	// error message
	let errorMsg = "";
	const activatedPlugins = JSON.parse(readFile(vaultPath + "/.obsidian/community-plugins.json"));
	if (!activatedPlugins.includes("metadata-extractor")) errorMsg += "Metadata Extractor is not installed or not enabled. \n";
	if (!activatedPlugins.includes("obsidian-advanced-uri")) errorMsg += "Advanced URI Plugin is not installed or not enabled. \n";

	return errorMsg;
}

