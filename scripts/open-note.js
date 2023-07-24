#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function getVaultNameEncoded() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath(
		$.getenv("alfred_workflow_data") + "/vaultPath",
	);
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const theVaultPath = ObjC.unwrap(vault);
	const vaultName = theVaultPath.replace(/.*\//, "");
	return encodeURIComponent(vaultName);
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const obsiRunningAlready = Application("Obsidian").running();

	const input = argv.join("").trim(); // trim to remove trailing \n
	const relativePath = input.split("#")[0].split(":")[0];
	const heading = input.split("#")[1];
	const lineNum = input.split(":")[1]; // used by `oe` external link search to open at line

	const vaultNameEnc = getVaultNameEncoded();

	// construct URI scheme -- https://vinzent03.github.io/obsidian-advanced-uri/actions/navigation
	let urlScheme =
		`obsidian://advanced-uri?vault=${vaultNameEnc}&filepath=` + encodeURIComponent(relativePath);
	if (heading) urlScheme += "&heading=" + encodeURIComponent(heading);
	else if (lineNum) urlScheme += "&line=" + encodeURIComponent(lineNum);

	app.openLocation(urlScheme);

	// press `Esc` to leave settings menu potentially open
	if (obsiRunningAlready) Application("System Events").keyCode(53);
}
