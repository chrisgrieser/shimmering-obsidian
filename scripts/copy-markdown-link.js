#!/usr/bin/env osascript -l JavaScript

function run(argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	function getVaultNameEncoded() {
		const _app = Application.currentApplication();
		_app.includeStandardAdditions = true;
		const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
		const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
		const _vaultPath = ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
		return encodeURIComponent(_vaultPath.replace(/.*\//, ""));
	}
	const vaultNameEnc = getVaultNameEncoded();

	// import variables
	const relativePath = argv.join("").split("#")[0];
	const heading = argv.join("").split("#")[1];
	let title = relativePath.split("/").pop();

	let urlScheme = "obsidian://";
	if (heading) {
		urlScheme +=
			"advanced-uri?vault=" +
			vaultNameEnc +
			"&filepath=" +
			encodeURIComponent(relativePath) +
			"&heading= " +
			encodeURIComponent(heading);
		title += " | " + heading;
	} else {
		urlScheme += "open?vault=" + vaultNameEnc + "&file=" + encodeURIComponent(relativePath);
	}

	return `[${title}](${urlScheme})`;
}
