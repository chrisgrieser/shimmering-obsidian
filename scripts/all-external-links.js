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

// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");

	/** @type AlfredItem[] */
	const externalLinks = app
		// PERF considered `rg`, but `grep` alone is actually surprisingly fast
		// already, making `grep` potentially a better choice since it does not
		// add a dependency
		.doShellScript(`cd "${vaultPath}" && grep -Eor "\\[[^[]*?\\]\\(http[^)]*\\)" --include=\\*.md .`)
		.split("\r")
		.map((line) => {
			const filename = line.split(":")[0].split("/").pop().slice(0, -3);
			const mdLink = line.split(":").slice(1).join(":");
			const [_, title, url] = mdLink.match(/\[([^[]*)\]\((.*)\)/);

			return {
				title: title,
				subtitle: `${filename.slice(0, 30)}  ·  ${url.slice(8)}`,
				arg: url,
				match: alfredMatcher(title) + alfredMatcher(filename) + alfredMatcher(url),
				uid: line,
				mods: {
					cmd: { arg: line },
				},
			};
		});

	return JSON.stringify({ items: externalLinks });
}
