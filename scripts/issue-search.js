#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import('Foundation');
app = Application.currentApplication();
app.includeStandardAdditions = true;
const readFile = function (path, encoding) {
    !encoding && (encoding = $.NSUTF8StringEncoding);
    const fm = $.NSFileManager.defaultManager;
    const data = fm.contentsAtPath(path);
    const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
    return ObjC.unwrap(str);
};

function alfredMatcher (str){
	return str.replace (/[-\(\)_\.]/g," ") + " " + str;
}

let jsonArray = [];

// get plugin issues
const repo = $.getenv('repo');
const issueAPI_URL =
	"https://api.github.com/repos/" + repo
	+ "/issues?state=all"
	+ "&per_page=100"; //GitHub API only returns 100 results https://stackoverflow.com/questions/30656761/github-search-api-only-return-30-results

const issue_JSON =
	JSON.parse(app.doShellScript('curl -s "' + issueAPI_URL + '"'))
	.sort(function (x,y) { //sort open issues on top
		let a = x.state;
		let b = y.state;
		return a == b ? 0 : a < b ? 1 : -1;
	});

// Get plugin version
let outOfDate = false;
let localVersion = "";
let latestVersion = "";

if ($.getenv('plugin_id')){
	let homepath = app.pathTo('home folder');
	let vault_path = $.getenv("vault_path").replace(/^~/, homepath);
	let manifestJSON =
		vault_path +
		"/.obsidian/plugins/" +
		$.getenv('plugin_id') +
		"/manifest.json";
	if (readFile(manifestJSON) != "") {
		localVersion = JSON.parse(readFile(manifestJSON)).version;
		latestVersion = app.doShellScript(
			"curl -sL https://github.com/" + repo +
			"/releases/latest/download/manifest.json" +
			" | grep 'version' | cut -d\\\" -f4"
		);
		if (localVersion != latestVersion) outOfDate = true;
	}
}


// out of date info OR option to create issue
if (outOfDate) {
	let title =
		"⚠️ New Version " +
		"for '" + $.getenv('plugin_name') + "' available";
	let subtitle =
		"New: v." + latestVersion + " ⬩ " +
		"Installed: v." + localVersion + " ⬩ " +
		"Press [return] to open Obsidian Settings for updating.";
	jsonArray.push({
		'title': title,
		'subtitle': subtitle,
		'arg': "obsidian://advanced-uri?commandid=hotkey-helper%253Aopen-plugins",
	});
} else {
	const newIssueURL = "https://github.com/" +	repo + "/issues/new?title=";
	jsonArray.push({
		'title': "🐛 New Bug Report",
		'arg': newIssueURL + encodeURIComponent("[BUG]: "),
	});
	jsonArray.push({
		'title': "🙏 New Feature Request",
		'arg': newIssueURL + encodeURIComponent("Feature Request: "),
	});
}

// existing issues
issue_JSON.forEach(issue => {
	let title = issue.title;
	let issue_creator = issue.user.login;

	let state = "";
	if (issue.state == "open") state += "🟢 ";
	else state += "🟣 ";
	if (title.toLowerCase().includes("request")) state += "🙏 ";
	if (title.toLowerCase().includes("suggestion")) state += "💡 ";
	if (title.toLowerCase().includes("bug")) state += "🐛 ";
	if (title.toLowerCase().includes("warning")) state += "⚠️ ";
	if (title.includes("?")) state += "❓ ";
	let comments = "";
	if (issue.comments != "0") comments = "   💬 " + issue.comments;

	jsonArray.push({
		'title': state + title,
		'match': issue.state + " " + alfredMatcher (title) + " " + alfredMatcher (issue_creator),
		'subtitle': "#" + issue.number + " by " + issue_creator	+ comments,
		'arg': issue.html_url,
	});
});

JSON.stringify({ items: jsonArray });
