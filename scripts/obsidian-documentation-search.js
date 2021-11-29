#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const jsonArray = [];
const communityDocsURL = "https://publish.obsidian.md/hub/";
const officialDocsURL = "https://help.obsidian.md/";
const rawGhURL = "https://raw.githubusercontent.com/obsidianmd/obsidian-docs/master/";
const discordReadyLinks = $.getenv("discord_ready_links");


// > COMMUNITY DOCS
//-----------------------------------
let communityDocs = JSON.parse (app.doShellScript (
	"curl -s 'https://api.github.com/repos/obsidian-community/obsidian-hub/git/trees/main?recursive=1'")).tree;
communityDocs = communityDocs.filter ( item =>
	item.path.slice(-3) === ".md"
);

communityDocs.forEach(item => {
	const area = item.path.split("/").slice(1, -1).join("/");
	const url = communityDocsURL + item.path.replaceAll (" ", "+");
	let title = item.path.split("/").pop().slice(0, -3);
	if (title.slice(0, 4) === "T - ") title = title.slice (4);
	const alfredMatcher = title.replaceAll("-", " ") + " " + title;

	let shareURL, isDiscordReady;
	if (discordReadyLinks) {
		shareURL = "<" + url + ">";
		isDiscordReady = " (discord ready)";
	} else {
		shareURL = url;
		isDiscordReady = "";
	}

	jsonArray.push({
		"title": title,
		"match": alfredMatcher,
		"subtitle": area,
		"icon": {"path" : "icons/community-vault.png"},
		"uid": url,
		"arg": url,
		"mods": {
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy GitHub Link" + isDiscordReady,
			}
		}
	});
});


// > OFFICIAL DOCS
// --------------------------------
let officialDocs = JSON.parse (app.doShellScript (
	"curl -s 'https://api.github.com/repos/obsidianmd/obsidian-docs/git/trees/master?recursive=1'")).tree;
officialDocs = officialDocs.filter ( item =>
	item.path.slice(-3) === ".md" &&
	item.path.slice(0, 3) === "en/" &&
	item.path.slice(0, 9) !== "en/.trash"
);

// get the headings
const documentationHeaders = [];
officialDocs.forEach(doc => {
	const docURL = rawGhURL + encodeURI(doc.path);
	const docHeaders = app.doShellScript("curl -s '" + docURL + "' | grep -E '^#' | cut -d ' ' -f 2-").split("\r");

	// add header to search hits
	if (docHeaders[0] !== ""){
		docHeaders.forEach(headerName => {
			documentationHeaders.push (doc.path + "#" + headerName);
		});
	}
});

documentationHeaders.forEach(header => {
	const headerName = header.split("#")[1];
	const area = header.split("#").slice(0, -1).join().slice(3, -3);
	const alfredMatcher = header.replace (/[/#`\-_]/g, " ");
	const url = officialDocsURL + header.slice(3).replaceAll(" ", "+");

	jsonArray.push({
		"title": headerName,
		"subtitle": area,
		"arg": url,
		"uid": url,
		"match": alfredMatcher,
	});
});


officialDocs.forEach(item => {
	const area = item.path.split("/").slice(1, -1).join("/");
	const url = officialDocsURL + item.path.slice(3, -3).replaceAll (" ", "+");
	const title = item.path.split("/").pop().slice(0, -3);
	const alfredMatcher = title.replaceAll("-", " ") + " " + title;

	jsonArray.push({
		"title": title,
		"match": alfredMatcher,
		"subtitle": area,
		"arg": url,
		"uid": url,
	});
});


// index and start-here
jsonArray.push({
	"title": "Index",
	"arg": "https://help.obsidian.md/Index",
	"uid": "1",
});

jsonArray.push({
	"title": "Start here",
	"arg": "https://help.obsidian.md/Start+here",
	"uid": "2",
});


JSON.stringify({ items: jsonArray });
