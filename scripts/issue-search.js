#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function alfredMatcher(str) {
	return str.replace(/[-()_.]/g, " ") + " " + str;
}

function SafeApplication(appId) {
	try {
		return Application(appId);
	} catch (error) {
		return null;
	}
}

const discordReadyLinks = ["Discord", "Discord PTB", "Discord Canary"].some(discordApp =>
	SafeApplication(discordApp)?.frontmost(),
);

//──────────────────────────────────────────────────────────────────────────────

function run() {
	const jsonArray = [];
	const repo = $.getenv("repoID");

	// get issues
	// GitHub API only returns 100 results https://stackoverflow.com/questions/30656761/github-search-api-only-return-30-results
	const issueAPIURL = `https://api.github.com/repos/${repo}/issues?state=all&per_page=100`;

	const issueJSON = JSON.parse(app.doShellScript(`curl -sL "${issueAPIURL}"`)) // issues json
		// sort open issues on top
		.sort((x, y) => {
			const a = x.state;
			const b = y.state;
			return a === b ? 0 : a < b ? 1 : -1; // eslint-disable-line no-nested-ternary
		});

	const newIssueURL = `https://github.com/${repo}/issues/new?title=`;
	jsonArray.push({
		title: "🪲 New Bug Report",
		arg: newIssueURL + encodeURIComponent("[BUG]: "),
	});
	jsonArray.push({
		title: "🙏 New Feature Request",
		arg: newIssueURL + encodeURIComponent("Feature Request: "),
	});

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
			shareURL = `<${issue.html_url}>`;
			isDiscordReady = " (discord ready)";
		} else {
			shareURL = issue.html_url;
			isDiscordReady = "";
		}

		const issueMatcher = [issue.state, alfredMatcher(title), alfredMatcher(issueCreator), "#" + issue.number].join(
			" ",
		);

		jsonArray.push({
			title: state + title,
			match: issueMatcher,
			subtitle: `#${issue.number} by ${issueCreator}${comments}`,
			arg: issue.html_url,
			mods: {
				alt: {
					arg: shareURL,
					subtitle: "⌥: Copy GitHub Link" + isDiscordReady,
				},
			},
		});
	});

	return JSON.stringify({ items: jsonArray });
}
