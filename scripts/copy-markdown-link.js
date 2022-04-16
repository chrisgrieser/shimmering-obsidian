#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	// import variables
	const relativePath = argv.join("").split("#")[0];
	const heading = argv.join("").split("#")[1];
	const vaultName = $.getenv("vault_path").split("/")
		.pop();
	let title = relativePath.split("/").pop();

	let urlScheme = "obsidian://";
	if (heading) {
		urlScheme +=
			"advanced-uri?vault=" + encodeURIComponent (vaultName) +
			"&filepath=" + encodeURIComponent(relativePath) +
			"&heading= " + encodeURIComponent(heading);
		title += " | " + heading;
	} else {
		urlScheme +=
			"open?vault=" + encodeURIComponent (vaultName) +
			"&file=" + encodeURIComponent(relativePath);
	}

	return "[" + title + "](" + urlScheme + ")";
}
