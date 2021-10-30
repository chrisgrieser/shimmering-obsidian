#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
let jsonArray = [];
const community_docs_url = "https://publish.obsidian.md/hub/";
const official_docs_url = "https://help.obsidian.md/";
const raw_gh_URL = "https://raw.githubusercontent.com/obsidianmd/obsidian-docs/master/";


// > COMMUNITY DOCS
//-----------------------------------
let community_docs = JSON.parse (app.doShellScript (
	"curl -s 'https://api.github.com/repos/obsidian-community/obsidian-hub/git/trees/main?recursive=1'")).tree;
community_docs = community_docs.filter ( item => 
	item.path.slice(-3) == '.md'
);

community_docs.forEach(item => {
	let area = item.path.split("/").slice(1,-1).join("/");
	let url = community_docs_url + item.path.replaceAll (" ", "+");
	let title = item.path.split("/").pop().slice(0, -3);
	if (title.slice(0,4) == "T - ") title = title.slice (4);
	let alfredMatcher = title.replaceAll("-"," ") + " " + title;

	jsonArray.push({
		'title': title,
		'match': alfredMatcher,
		'subtitle': area,
		'arg': url,
		'uid': url,
		'icon': {'path' : 'icons/community-vault.png'},
	});
});


// > OFFICIAL DOCS
// --------------------------------
let official_docs = JSON.parse (app.doShellScript (
	"curl -s 'https://api.github.com/repos/obsidianmd/obsidian-docs/git/trees/master?recursive=1'")).tree;
official_docs = official_docs.filter ( item => 
	item.path.slice(-3) == '.md' && 
	item.path.slice(0, 3) == 'en/' &&
	item.path.slice(0, 9) != 'en/.trash'
);

// get the headings
var documentation_headers = [];
official_docs.forEach(doc => {
	let doc_url = raw_gh_URL + encodeURI(doc.path);
	let doc_headers = app.doShellScript("curl -s '" + doc_url + "' | grep -E '^#' | cut -d ' ' -f 2-").split("\r");

	//add header to search hits
	if (doc_headers[0] != ""){
		doc_headers.forEach(header_name => {
			documentation_headers.push (doc.path + "#" + header_name);
		});
	}
});

documentation_headers.forEach(header => {
	let header_name = header.split("#")[1];
	let area = header.split("#").slice(0,-1).join().slice(3,-3);
	let alfredMatcher = header.replace (/[\/#`\-_]/g," ");
	let url = official_docs_url + header.slice(3).replaceAll(" ", "+");

	jsonArray.push({
		'title': header_name,
		'subtitle': area,
		'arg': url,
		'uid': url,
		'match': alfredMatcher,
	});
});


official_docs.forEach(item => {
	let area = item.path.split("/").slice(1,-1).join("/");
	let url = official_docs_url + item.path.slice(3, -3).replaceAll (" ", "+");
	let title = item.path.split("/").pop().slice(0, -3);
	let alfredMatcher = title.replaceAll("-"," ") + " " + title;

	jsonArray.push({
		'title': title,
		'match': alfredMatcher,
		'subtitle': area,
		'arg': url,
		'uid': url,
	});
});


//index and start-here
jsonArray.push({
	'title': "Index",
	'arg': "https://help.obsidian.md/Index",
	'uid': "1",
});

jsonArray.push({
	'title': "Start here",
	'arg': "https://help.obsidian.md/Start+here",
	'uid': "2",
});


JSON.stringify({ items: jsonArray });
