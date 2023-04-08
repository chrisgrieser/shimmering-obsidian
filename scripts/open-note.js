#!/usr/bin/env osascript -l JavaScript
function run(argv) {
	ObjC.import("stdlib");

	const obsiRunningAlready = Application("Obsidian").running();

	// import variables
	const input = argv.join("").trim(); // trim to remove trailing \n
	const relativePath = input.split("#")[0];
	const heading = input.split("#")[1];

	function getVaultNameEncoded() {
		const theApp = Application.currentApplication();
		theApp.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		const theVaultPath = ObjC.unwrap(vault);
		const vaultName = theVaultPath.replace(/.*\//, "");
		return encodeURIComponent(vaultName);
	}
	const vaultNameEnc = getVaultNameEncoded();

	let urlScheme = `obsidian://advanced-uri?vault=${vaultNameEnc}&filepath=` + encodeURIComponent(relativePath);
	if (heading) urlScheme += "&heading=" + encodeURIComponent(heading);

	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	app.openLocation(urlScheme);

	// press 'Esc' to leave settings menu
	if (obsiRunningAlready) Application("System Events").keyCode(53); // eslint-disable-line no-magic-numbers
}
