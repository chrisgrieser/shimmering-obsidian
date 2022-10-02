#!/usr/bin/env osascript -l JavaScript
function run (argv) {
	ObjC.import("stdlib");

	const obsiRunningAlready = Application("Obsidian").running();

	// import variables
	const input = argv.join("").trim();
	const relativePath = input.split("#")[0];
	const heading = input.split("#")[1];
	const vaultNameENC = $.getenv("vault_name_ENC");

	let urlScheme = `obsidian://advanced-uri?vault=${vaultNameENC}&filepath=`
		+ encodeURIComponent(relativePath);
	if (heading) urlScheme += "&heading=" + encodeURIComponent(heading);

	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	app.openLocation (urlScheme);

	// press 'Esc' to leave settings menu
	if (obsiRunningAlready) Application("System Events").keyCode(53); // eslint-disable-line no-magic-numbers

	if ($.getenv("alfred_debug") === "1") {
		console.log("Encoded Vault Name: " + vaultNameENC);
		console.log("Relative Path: " + relativePath);
		console.log("Heading: " + heading);
		console.log("URL Scheme: " + urlScheme);
	}

}
