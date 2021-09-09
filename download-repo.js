#!/usr/bin/env osascript -l JavaScript

function run (argv){
	ObjC.import('stdlib');
	app = Application.currentApplication();
	app.includeStandardAdditions = true;
	const homepath = app.pathTo('home folder');
	// import variables
	let githubURL = argv.join("");
	let download_folder_path = $.getenv("download_folder_path").replace(/^~/, homepath);

	//in case it's a theme
	if (githubURL.match(/\.css$/i) != null){
		let theme_name = githubURL.replace(/https?:\/\/github.com\/.*?\/(.*?)\/.*/,"$1");
		let dl_target = download_folder_path + "/" + theme_name + ".css";
		app.doShellScript('curl -s "' + githubURL + '" > "' + dl_target + '"');
		app.doShellScript('open -R "' + dl_target + '"'); //open folder

	// in case its a plugin
	} else {
		app.doShellScript('cd "' + download_folder_path + '" && git clone "' + githubURL + '"');
		let folder_name = githubURL.replace (/.*\//,"");
		app.doShellScript('open "' + download_folder_path + '/' + folder_name + '"'); //open folder
	}
}
