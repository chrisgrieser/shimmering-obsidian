#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");

	// import variables
	const relativePath = argv.join("").split("#")[0];
	const heading = argv.join("").split("#")[1];
	const vaultName = $.getenv("vault_path").split("/").pop();

	let urlScheme = "obsidian://";
	if (heading === undefined) {
		urlScheme +=
			"open?vault=" + encodeURIComponent (vaultName) +
			"&file=" + encodeURIComponent(relativePath);
	} else {
		urlScheme +=
			"advanced-uri?vault=" + encodeURIComponent (vaultName) +
			"&filepath=" + encodeURIComponent(relativePath) +
			"&heading= " + encodeURIComponent(heading);
	}

	app = Application.currentApplication();
	app.includeStandardAdditions = true;
	app.openLocation (urlScheme);
}
