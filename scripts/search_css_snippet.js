#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/** @param {string} str */
function alfredMatcher(str) {
	const clean = str.replace(/[-()_.:#]/g, " ");
	const camelCaseSeperated = str.replace(/([A-Z])/g, " $1");
	return [clean, camelCaseSeperated, str].join(" ");
}

//──────────────────────────────────────────────────────────────────────────────
/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");

	const snippetArr = app
		.doShellScript(`find '${vaultPath}/${configFolder}/snippets/' -name '*.css'`)
		.split("\r")
		.map((snippetFilePath) => {
			const filename = snippetFilePath.replace(/.*\/(.*)\..+/, "$1");
			return {
				title: filename,
				match: alfredMatcher(filename),
				arg: snippetFilePath,
				subtitle: "snippet",
				type: "file:skipcheck",
				uid: snippetFilePath,
			};
		});

	return JSON.stringify({ items: snippetArr });
}
