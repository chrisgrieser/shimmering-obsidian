#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");

	// import variables
	const input = argv.join("").trim();
	const relativePath = input.split("#")[0];
	const heading = input.split("#")[1];
	const vaultNameENC = $.getenv("vault_name_ENC");

	let urlScheme = "obsidian://";
	if (heading) {
		urlScheme +=
			"advanced-uri?vault=" + vaultNameENC +
			"&filepath=" + encodeURIComponent(relativePath) +
			"&heading=" + encodeURIComponent(heading);
	} else {
		urlScheme +=
			"open?vault=" + vaultNameENC +
			"&file=" + encodeURIComponent(relativePath);
	}

	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	app.openLocation (urlScheme);

	// press 'Esc' to leave settings menu
	Application("System Events").keyCode(53); // eslint-disable-line no-magic-numbers

	// for debugging
	if ($.getenv("alfred_debug") === "1") {
		console.log("Encoded Vault Name: " + vaultNameENC);
		console.log("Relative Path: " + relativePath);
		console.log("Heading: " + heading);
		console.log("URL Scheme: " + urlScheme);
	}

}
