#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/** @param {string} str */
function alfredMatcher(str) {
	const clean = str.replace(/[-()_.:#/\\;,[\]]/g, " ");
	return [clean, str].join(" ") + " ";
}

//──────────────────────────────────────────────────────────────────────────────

// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");

	/** @type AlfredItem[] */
	const externalLinks = app
		// PERF considered `rg`, but `grep` alone is actually surprisingly fast
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
