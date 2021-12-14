#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");

	// import variables
	const relativePath = argv.join("").split("#")[0];
	const heading = argv.join("").split("#")[1];
	const vaultName = $.getenv("vault_name_ENC");

	let urlScheme = "obsidian://";
	if (!heading) urlScheme +=
		"open?vault=" + vaultName +
		"&file=" + encodeURIComponent(relativePath);
	if (heading) urlScheme +=
		"advanced-uri?vault=" + vaultName +
		"&filepath=" + encodeURIComponent(relativePath) +
		"&heading= " + encodeURIComponent(heading);

	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	app.openLocation (urlScheme);
}
