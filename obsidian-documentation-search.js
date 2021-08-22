#!/usr/bin/env osascript -l JavaScript
app = Application.currentApplication();
app.includeStandardAdditions = true;

//get all documentation document urls
var documentation_docs = app.doShellScript("curl -s 'https://api.github.com/repos/obsidianmd/obsidian-docs/git/trees/master?recursive=1' | grep -E 'en/.*\.md' | grep -v '/.trash' | cut -c 19- | cut -d '.' -f 1").split("\r");

//get the headings from those documents
var documentation_headers = [];
documentation_docs.forEach(doc => {
	//get URL
	var doc_url = "https://raw.githubusercontent.com/obsidianmd/obsidian-docs/master/en/" + encodeURI (doc) + ".md";

	//grep headings
	var doc_headers = app.doShellScript("curl '" + doc_url + "' | grep -E '^#' | cut -d ' ' -f 2-").split("\r");

	//add header to search hits, if existent
	if (doc_headers[0] != ""){
		doc_headers.forEach(header => {
			documentation_headers.push (doc + "#" + header);
		});
	}
});


let jsonArray = [];

// add headings
documentation_headers.forEach(header => {
	let header_name = header.replace (/(.*?)\/(.*?)#(.*)/,"$3");
	let doc = header.replace (/(.*?)\/(.*?)#(.*)/,"$1/$2");
	let alfredMatcher = header.replace (/[\/#]/g," ");
	let url = "https://help.obsidian.md/" + header.replaceAll (" ", "+");

	jsonArray.push({
		'title': header_name,
		'subtitle': doc,
		'arg': url,
		'uid': url,
		'match': alfredMatcher,
	});
});

// add documents themselves as well
documentation_docs.forEach(doc => {
	let doc_title = doc.replace (/(.*?)\/(.*)/,"$2");
	let area = doc.replace (/(.*?)\/(.*)/,"$1");
	let alfredMatcher = doc.replace ("/"," ");
	let url = "https://help.obsidian.md/" + doc.replaceAll (" ", "+");

	jsonArray.push({
		'title': doc_title,
		'subtitle': area,
		'arg': url,
		'uid': url,
		'match': alfredMatcher,
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
