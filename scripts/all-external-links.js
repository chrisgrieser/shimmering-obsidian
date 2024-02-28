#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

/** @param {string} str */
function alfredMatcher(str) {
	const clean = str.replace(/[^\w\s]+/g, " ");
	return [clean, str].join(" ") + " ";
}

//──────────────────────────────────────────────────────────────────────────────

// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");

	/** @type AlfredItem[] */
	const externalLinks = app
		// PERF considered `rg`, but `grep` alone is actually surprisingly fast
		// already, making `grep` a better choice since it does not add a dependency
		.doShellScript(`cd "${vaultPath}" && grep "\\[[^[]*?\\]\\(http[^)]*\\)" \
		--include=\\*.md --recursive --line-number --only-matching --extended-regexp .`)
		.split("\r")
		.map((line) => {
			const [filename, lnum, ...mdLink] = line.split(":");
			const [_, title, url] = mdLink.join(":").match(/\[([^[]*)\]\((.*)\)/);

			return {
				title: title,
				subtitle: `${filename.slice(0, 30)}  ·  ${url.slice(8)}`,
				arg: url,
				match: alfredMatcher(title) + alfredMatcher(filename) + alfredMatcher(url),
				uid: line,
				mods: {
					cmd: { arg: filename + ":" + lnum },
				},
			};
		});

	return JSON.stringify({
		items: externalLinks,
		cache: {
			seconds: 300,
			loosereload: true,
		},
	});
}
