#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	app = Application.currentApplication();
	app.includeStandardAdditions = true;

	// import variables
	const relativePath = argv.join("").split("#")[0];
	const heading = argv.join("").split("#")[1];
	const vaultName = $.getenv("vault_path").split("/").pop();

	let urlScheme = "obsidian://";
	if (heading === undefined) {
		urlScheme +=
			"open?vault=" + encodeURIComponent (vault_name) +
			"&file=" + encodeURIComponent(relativePath);
	} else {
		urlScheme +=
			"advanced-uri?vault=" + encodeURIComponent (vault_name) +
			"&filepath=" + encodeURIComponent(relativePath) +
			"&heading= " + encodeURIComponent(heading);
	}

	app.openLocation (urlScheme);
	return urlScheme;
}
