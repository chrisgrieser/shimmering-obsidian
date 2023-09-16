#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const vaultPath = $.getenv("vault_path");
	const vaultNameEnc = encodeURIComponent(vaultPath.replace(/.*\//, ""));

	const obsiRunningAlready = Application("Obsidian").running();

	const input = argv[0].trim(); // trim to remove trailing \n
	const relativePath = input.split("#")[0].split(":")[0];
	const heading = input.split("#")[1];
	const lineNum = input.split(":")[1]; // used by `oe` external link search to open at line

	// construct URI scheme -- https://vinzent03.github.io/obsidian-advanced-uri/actions/navigation
	let urlScheme =
		`obsidian://advanced-uri?vault=${vaultNameEnc}&filepath=` + encodeURIComponent(relativePath);
	if (heading) urlScheme += "&heading=" + encodeURIComponent(heading);
	else if (lineNum) urlScheme += "&line=" + encodeURIComponent(lineNum);

	app.openLocation(urlScheme);

	// press `Esc` to leave settings menu potentially open
	if (obsiRunningAlready) Application("System Events").keyCode(53);
}
