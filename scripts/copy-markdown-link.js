#!/usr/bin/env osascript -l JavaScript

function run (argv){
	ObjC.import('stdlib');
	app = Application.currentApplication();
	app.includeStandardAdditions = true;

	//import variables
	const relativePath = argv.join("").split("#")[0];
	const heading = argv.join("").split("#")[1];
	const vault_name = $.getenv('vault_path').split("/").pop();
	let title = relativePath.split("/").pop();

	let url_scheme = "obsidian://";
	if (heading == undefined) {
		url_scheme +=
			"open?vault=" + encodeURIComponent (vault_name) +
			"&file=" + encodeURIComponent(relativePath);
	} else {
		url_scheme +=
			"advanced-uri?vault=" + encodeURIComponent (vault_name) +
			"&filepath=" + encodeURIComponent(relativePath) +
			"&heading= " + encodeURIComponent(heading);
		title += " | " + heading;
	}

	return "[" + title + "](" + url_scheme + ")";
}
