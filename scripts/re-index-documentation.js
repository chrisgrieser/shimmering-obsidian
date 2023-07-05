#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function onlineJSON (url) {
	return JSON.parse (app.doShellScript(`curl -sL  "${url}"`));
}

function alfredMatcher (str) {
	// not the same Alfred Matcher used in the other scripts
	// has to include "#" and "+" as well for headers
	// "`" has to be included for inline code in headers
	return " " + str.replace (/[-()_#+.`]/g, " ") + " " + str + " ";
}

const jsonArray = [];
const officialDocsURL = "https://help.obsidian.md/";
const officialDocsJSON = onlineJSON("https://api.github.com/repos/obsidianmd/obsidian-docs/git/trees/master?recursive=1");
const rawGitHubURL = "https://raw.githubusercontent.com/obsidianmd/obsidian-docs/master/";
const communityDocsURL = "https://publish.obsidian.md/hub/";
const communityDocsJSON = onlineJSON("https://api.github.com/repos/obsidian-community/obsidian-hub/git/trees/main?recursive=1");


// < OFFICIAL DOCS
// --------------------------------
const officialDocs =	officialDocsJSON
	.tree
	.filter (item =>
		item.path.slice(-3) === ".md" &&
		item.path.slice(0, 3) === "en/" &&
		item.path.slice(0, 9) !== "en/.trash",
	);

officialDocs.forEach(item => {
	const area = item.path.split("/").slice(1, -1)
		.join("/");
	const url = officialDocsURL + item.path.slice(3, -3).replaceAll (" ", "+");
	const title = item.path.split("/").pop()
		.slice(0, -3);

	jsonArray.push({
		"title": title,
		"match": alfredMatcher(title),
		"subtitle": area,
		"uid": url,
		"arg": url,
	});
});

// < HEADINGS of Official Docs
// --------------------------------
const documentationHeaders = [];
officialDocs.forEach(doc => {
	const docURL = rawGitHubURL + encodeURI(doc.path);
	const docHeaders = app.doShellScript("curl -sL '" + docURL + "' | grep -E '^#' | cut -d ' ' -f 2-").split("\r");

	// add header to search hits
	if (docHeaders[0] !== "") {
		docHeaders.forEach(headerName => {
			documentationHeaders.push (doc.path + "#" + headerName);
		});
	}
});

documentationHeaders.forEach(header => {
	const headerName = header.split("#")[1];
	const area = header.split("#").slice(0, -1)
		.join()
		.slice(3, -3);
	const url = officialDocsURL + header.slice(3).replaceAll(" ", "+");

	jsonArray.push({
		"title": headerName,
		"subtitle": area,
		"uid": url,
		"match": alfredMatcher(header),
		"arg": url,
	});
});


// < COMMUNITY DOCS
//-----------------------------------
const communityDocs =
	communityDocsJSON
		.tree
		.filter (item => item.path.slice(-3) === ".md" )
		.filter (item => !item.path.startsWith(".github/"));

communityDocs.forEach(item => {
	const area = item.path.split("/").slice(1, -1)
		.join("/");
	const url = communityDocsURL + item.path.replaceAll (" ", "+");
	const title = item.path.split("/").pop()
		.slice(0, -3);

	jsonArray.push({
		"title": title,
		"match": alfredMatcher(title),
		"icon": { "path" : "icons/community-vault.png" },
		"subtitle": area,
		"uid": url,
		"arg": url,
	});
});

JSON.stringify({ items: jsonArray });
