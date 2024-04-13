#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} url @return {string} */
function httpRequest(url) {
	const queryURL = $.NSURL.URLWithString(url);
	const data = $.NSData.dataWithContentsOfURL(queryURL);
	const requestStr = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding).js;
	return requestStr;
}

/** @param {string} str */
function alfredMatcher(str) {
	const clean = str.replace(/[-_/]/g, " ");
	return [clean, str].join(" ") + " ";
}

/** @param {string} str */
function capitalize(str) {
	const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
	return capitalized.replace(/[-_]/g, " ");
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	// DOCS docsurls
	const dvDocsSource =
		"https://api.github.com/repos/blacksmithgu/obsidian-dataview/git/trees/master?recursive=1";
	const dvDocsBaseURL = "https://blacksmithgu.github.io/obsidian-dataview";
	const docsPathRegex = /docs\/docs\/(.*)\.md/;

	const dvDocs = JSON.parse(httpRequest(dvDocsSource))
		.tree.filter((/** @type {{ path: string; }} */ file) => docsPathRegex.test(file.path))
		.map((/** @type {{ path: string }} */ file) => {
			const site = (file.path.match(docsPathRegex) || ["error", "error"])[1];
			const parts = site.split("/");
			const subsite = parts.pop() || "error";
			const parent = parts.join("/");

			return {
				title: capitalize(subsite),
				subtitle: capitalize(parent),
				match: alfredMatcher(site),
				arg: `${dvDocsBaseURL}/${site}/`,
			};
		});

	return JSON.stringify({
		items: dvDocs,
		cache: {
			seconds: 3600 * 24,
			loosereload: true,
		},
	});
}
