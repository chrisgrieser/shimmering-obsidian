#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	// import variables
	const githubURL = argv.join("");
	const homepath = app.pathTo("home folder");
	const downloadFolderPath = $.getenv("download_folder_path").replace(/^~/, homepath);

	// in case it's a theme
	if (githubURL.slice(-4) === ".css") {
		const themeName = githubURL.split("/")[4];
		const dlTarget = downloadFolderPath + "/" + themeName + ".css";
		app.doShellScript('curl -sL "' + githubURL + '" > "' + dlTarget + '"');
		app.doShellScript('open -R "' + dlTarget + '"'); // reveal in Finder

	// in case it's a plugin
	} else {
		app.doShellScript('cd "' + downloadFolderPath + '" && git clone "' + githubURL + '"');
		const folderName = githubURL.split("/").pop();
		app.doShellScript('open "' + downloadFolderPath + "/" + folderName + '"'); // open folder
	}
}
