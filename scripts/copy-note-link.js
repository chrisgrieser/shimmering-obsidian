#!/usr/bin/env osascript -l JavaScript

function run(argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

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

	// import variables
	const relativePath = argv.join("").split("#")[0];
	const heading = argv.join("").split("#")[1];
	const linkType = $.getenv("link_type_to_copy");

	//───────────────────────────────────────────────────────────────────────────

	let filenameNoExt = relativePath
		.split("/")
		.pop()
		.replace(/\.\w+$/, "");
	let toCopy;

	if (linkType === "Markdown Link" && heading) {
		const urlScheme =
			"obsidian://advanced-uri?vault=" +
			vaultNameEnc +
			"&filepath=" +
			encodeURIComponent(relativePath) +
			"&heading= " +
			encodeURIComponent(heading);
		filenameNoExt += " | " + heading;
		toCopy = `[${filenameNoExt}](${urlScheme})`;
	} else if (linkType === "Markdown Link" && !heading) {
		const urlScheme = "obsidian://open?vault=" + vaultNameEnc + "&file=" + encodeURIComponent(relativePath);
		toCopy = `[${filenameNoExt}](${urlScheme})`;
	} else if (linkType === "Wikilink" && heading) {
		toCopy = `[[${filenameNoExt}#${heading}]]`;
	} else if (linkType === "Wikilink" && !heading) {
		toCopy = `[[${filenameNoExt}]]`;
	}

	app.setTheClipboardTo(toCopy);
	return toCopy; // also return for the notification
}
