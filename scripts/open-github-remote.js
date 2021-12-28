#!/usr/bin/env osascript -l JavaScript

function run (argv) {
	ObjC.import("stdlib");
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	const vaultPath =  $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));

	const remoteURL = app.doShellScript("cd '" + vaultPath + "'; git remote -v | grep git@github.com | grep fetch | head -n1 | cut -f2 | cut -d' ' -f1 | sed -e 's/:/\\//' -e 's/git@/https:\\/\\//' -e 's/\\.git//' ");

	const relativePath = argv.join("").trim();

	const fileRemoteURL = remoteURL + "/commits/main/" + encodeURIComponent(relativePath);

	app.openLocation(fileRemoteURL);
}
