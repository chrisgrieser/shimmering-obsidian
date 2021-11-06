#!/usr/bin/env osascript -l JavaScript

function run (argv){
	ObjC.import('stdlib');
	app = Application.currentApplication();
	app.includeStandardAdditions = true;

	// import variables
	const githubURL = argv.join("");
	const homepath = app.pathTo('home folder');
	const download_folder_path = $.getenv("download_folder_path").replace(/^~/, homepath);

	//in case it's a theme
	if (githubURL.slice(-4) == ".css"){
		let theme_name = githubURL.split("/")[4];
		let dl_target = download_folder_path + "/" + theme_name + ".css";
		app.doShellScript('curl -sL "' + githubURL + '" > "' + dl_target + '"');
		app.doShellScript('open -R "' + dl_target + '"'); //reveal in Finder

	// in case it's a plugin
	} else {
		app.doShellScript('cd "' + download_folder_path + '" && git clone "' + githubURL + '"');
		let folder_name = githubURL.split("/").pop();
		app.doShellScript('open "' + download_folder_path + '/' + folder_name + '"'); //open folder
	}
}
