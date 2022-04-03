#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
function readFile (path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

function alfredMatcher (str) {
	return str.replace (/[-()_.]/g, " ") + " " + str;
}

function SafeApplication(appId) {
	try {
		return Application(appId);
	} catch (e) {
		return null;
	}
}
const discordReadyLinks = ["Discord", "Discord PTB", "Discord Canary"]
	.some(discordApp => SafeApplication(discordApp)?.frontmost());
const jsonArray = [];
const repo = $.getenv("repo");

// get plugin issues
const issueAPIURL =
	"https://api.github.com/repos/" + repo
	+ "/issues?state=all"
	+ "&per_page=100"; // GitHub API only returns 100 results https://stackoverflow.com/questions/30656761/github-search-api-only-return-30-results

const issueJSON =
	JSON.parse(app.doShellScript("curl -s \"" + issueAPIURL + "\""))
		.sort(function (x, y) { // sort open issues on top
			const a = x.state;
			const b = y.state;
			return a === b ? 0 : a < b ? 1 : -1; // eslint-disable-line no-nested-ternary
		});

// Get plugin version
let outOfDate = false;
let localVersion = "";
let latestVersion = "";

if ($.getenv("plugin_id")) {
	const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
	const manifestJSON =
		vaultPath +
		"/.obsidian/plugins/" +
		$.getenv("plugin_id") +
		"/manifest.json";
	if (readFile(manifestJSON) !== "") {
		localVersion = JSON.parse(readFile(manifestJSON)).version;
		latestVersion = JSON.parse(
			app.doShellScript(
				"curl -sL https://github.com/" + repo +
				"/releases/latest/download/manifest.json")
		).version;
		if (localVersion !== latestVersion) outOfDate = true;
	}
}


// out of date info OR option to create issue
if (outOfDate) {
	const title =
		"⚠️ New Version " +
		"for '" + $.getenv("plugin_name") + "' available";
	const subtitle =
		"New: v." + latestVersion + " ⬩ " +
		"Installed: v." + localVersion + " ⬩ " +
		"Press [return] to open Obsidian Settings for updating.";
	jsonArray.push({
		"title": title,
		"subtitle": subtitle,
		"arg": "obsidian://advanced-uri?vault=" + $.getenv("vault_name_ENC") + "&updateplugins=true",
	});
} else {
	const newIssueURL = "https://github.com/" +	repo + "/issues/new?title=";
	jsonArray.push({
		"title": "🪲 New Bug Report",
		"arg": newIssueURL + encodeURIComponent("[BUG]: "),
	});
	jsonArray.push({
		"title": "🙏 New Feature Request",
		"arg": newIssueURL + encodeURIComponent("Feature Request: "),
	});
}

// existing issues
issueJSON.forEach(issue => {
	const title = issue.title;
	const issueCreator = issue.user.login;

	let state = "";
	if (issue.state === "open") state += "🟢 ";
	else state += "🟣 ";
	if (title.toLowerCase().includes("request") || title.includes("FR")) state += "🙏 ";
	if (title.toLowerCase().includes("suggestion")) state += "💡 ";
	if (title.toLowerCase().includes("bug")) state += "🪲 ";
	if (title.includes("?")) state += "❓ ";
	let comments = "";
	if (issue.comments !== "0") comments = "   💬 " + issue.comments;

	let isDiscordReady, shareURL;
	if (discordReadyLinks) {
		shareURL = "<" + issue.html_url + ">";
		isDiscordReady = " (discord ready)";
	} else {
		shareURL = issue.html_url;
		isDiscordReady = "";
	}

	const issueMatcher = [
		issue.state,
		alfredMatcher(title),
		alfredMatcher(issueCreator),
		"#" + issue.number
	].join(" ");

	jsonArray.push({
		"title": state + title,
		"match": issueMatcher,
		"subtitle": "#" + issue.number + " by " + issueCreator + comments,
		"arg": issue.html_url,
		"mods": {
			"alt": {
				"arg": shareURL,
				"subtitle": "⌥: Copy GitHub Link" + isDiscordReady,
			}
		}
	});
});

JSON.stringify({ items: jsonArray });
