#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function getVaultPath() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath(
		$.getenv("alfred_workflow_data") + "/vaultPath",
	);
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	return ObjC.unwrap(vault).replace(/^~/, theApp.pathTo("home folder"));
}

/** @param {string} str */
function alfredMatcher(str) {
	const clean = str.replace(/[-()_.:#/\\;,[\]]/g, " ");
	return [clean, str].join(" ") + " ";
}

//──────────────────────────────────────────────────────────────────────────────

// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = getVaultPath();

	/** @type AlfredItem[] */
	const externalLinks = app
		// yes, I considered `rg`, but `grep` alone is actually surprisingly fast
		// already, making `grep` potentially a better choice since it does not
		// add a dependency
		.doShellScript(`cd "${vaultPath}" && grep -Eoh "\\[[^[]*?\\]\\(http[^)]*\\)" ./**/*.md`)
		.split("\r")
		.map((mdlink) => {
			const [_, title, url] = mdlink.match(/\[([^[]*)\]\((.*)\)/);
			return {
				title: title,
				subtitle: url,
				arg: url,
				match: alfredMatcher(title) + alfredMatcher(url),
				uid: mdlink,
				mods: {
					cmd: { arg: mdlink },
				},
			};
		});

	return JSON.stringify({ items: externalLinks });
}
