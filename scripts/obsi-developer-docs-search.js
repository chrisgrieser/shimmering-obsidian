#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} str */
function camelCaseMatch(str) {
	const subwords = str.replace(/[-_./]/g, " ");
	const fullword = str.replace(/[-_./]/g, "");
	const camelCaseSeparated = str.replace(/([A-Z])/g, " $1");
	return [subwords, camelCaseSeparated, fullword, str].join(" ") + " ";
}

/** @param {string} url @return {string} */
function httpRequest(url) {
	const queryURL = $.NSURL.URLWithString(url);
	const data = $.NSData.dataWithContentsOfURL(queryURL);
	const requestStr = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding).js;
	return requestStr;
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const obsiDocsSource =
		"https://api.github.com/repos/obsidianmd/obsidian-developer-docs/git/trees/main?recursive=1";
	const obsiDocsBaseURL = "https://docs.obsidian.md";

	const obsiDocs = JSON.parse(httpRequest(obsiDocsSource))
		.tree.filter(
			(/** @type {{ path: string; }} */ file) =>
				file.path.startsWith("en/") && file.path.endsWith(".md"),
		)
		.map((/** @type {{ path: string }} */ file) => {
			const subsitePath = file.path.slice(3, -3);

			const displayTitle = subsitePath.replace(/.*\//, ""); // show only file name

			const category = subsitePath
				.replace(/(.*)\/.*/, "$1") // only parent
				.replaceAll("/", " → "); // nicer tree

			const subsiteURL = subsitePath.replaceAll(" ", "+"); // obsidian publish uses `+`

			return {
				title: displayTitle,
				subtitle: category,
				match: camelCaseMatch(subsitePath),
				arg: `${obsiDocsBaseURL}/${subsiteURL}`,
				uid: subsitePath,
			};
		});

	//───────────────────────────────────────────────────────────────────────────

	const codeMirrorDocsSource = "https://codemirror.net/docs/ref/";
	const ahrefRegex = /<a href="(#.*?)"/i;

	const codeMirrorDocs = httpRequest(codeMirrorDocsSource)
		.split("\n")
		.filter((line) => line.includes('a href="#'))
		.map((line) => {
			const [_, anchor] = line.match(ahrefRegex) || [null, null];
			if (!anchor) return {};
			const url = codeMirrorDocsSource + anchor;
			const data = decodeURIComponent(anchor).slice(1);

			const [__, category, title] = data.match(/(.*)[.^](.*)/) || [null, "@codemirror", data];

			return {
				title: title,
				subtitle: category,
				match: camelCaseMatch(title) + camelCaseMatch(category),
				icon: { path: "icons/codemirror-logo.png" },
				arg: url,
				uid: url,
			};
		});

	return JSON.stringify({
		items: [...obsiDocs, ...codeMirrorDocs],
		cache: {
			seconds: 3600 * 24 * 7,
			loosereload: true,
		},
	});
}
