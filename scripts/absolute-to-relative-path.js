#!/usr/bin/env osascript -l JavaScript

function run (argv){
	ObjC.import('stdlib');
	app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const vault_path = $.getenv("vault_path").replace(/^~/, app.pathTo('home folder'));

	const absolutePath = argv.join("");
	const relativePath = absolutePath.slice (vault_path.length);

	return relativePath;
}
