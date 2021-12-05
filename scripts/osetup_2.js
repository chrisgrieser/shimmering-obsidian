#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	const vaultPath = argv.join("");
	const vaultName = vaultPath.split("/").pop();

	Application("com.runningwithcrayons.Alfred").setConfiguration ("vault_path", {
		toValue: vaultPath,
		inWorkflow: $.getenv("alfred_workflow_bundleid"),
		exportable: false
	});
	
	Application("com.runningwithcrayons.Alfred").setConfiguration ("vault_name", {
		toValue: vaultName,
		inWorkflow: $.getenv("alfred_workflow_bundleid"),
		exportable: false
	});

}

