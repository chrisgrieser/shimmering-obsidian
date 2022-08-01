#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
const alfredMatcher = (str) => str.replace (/[-()_/.]/g, " ") + " " + str + " ";

String.prototype.capitalizeWords = function () {
	return this.replace(/\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1));
};

//------------------------------------------------------------------------------

const workArray = JSON.parse(app.doShellScript('curl -s "https://api.github.com/repos/marcusolsson/obsidian-plugin-docs/git/trees/main?recursive=1"'))
	.tree
	.filter(file => file.path.startsWith("docs/"))
	.filter(file => file.path.endsWith(".md"))
	.map(file => {
		const subsitePath = file.path.slice(5, -3);

		const displayTitle = subsitePath
			.replace(/.*\//, "") // show only file name
			.capitalizeWords()
			.replaceAll("-", " ");

		const category = subsitePath
			.replace(/(.*)\/.*/, "$1") // only parent
			.replaceAll ("/", " → ") // nicer tree
			.capitalizeWords()
			.replaceAll("-", " ");

		return {
			"title": displayTitle,
			"subtitle": category,
			"match": alfredMatcher (subsitePath),
			"arg": `https://marcus.se.net/obsidian-plugin-docs/${subsitePath}`,
			"uid": subsitePath,
		};
	});

JSON.stringify({ items: workArray });
