#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function browserTab() {
	const frontmostAppName = Application("System Events").applicationProcesses.where({ frontmost: true }).name()[0];
	const frontmostApp = Application(frontmostAppName);
	const chromiumVariants = ["Google Chrome", "Chromium", "Opera", "Vivaldi", "Brave Browser", "Microsoft Edge"];
	const webkitVariants = ["Safari", "Webkit"];
	let title, url;
	if (chromiumVariants.some(appName => frontmostAppName.startsWith(appName))) {
		url = frontmostApp.windows[0].activeTab.url();
		title = frontmostApp.windows[0].activeTab.name();
	} else if (webkitVariants.some(appName => frontmostAppName.startsWith(appName))) {
		url = frontmostApp.documents[0].url();
		title = frontmostApp.documents[0].name();
	} else {
		return false;
	}
	return { url: url, title: title };
}

//──────────────────────────────────────────────────────────────────────────────

function run() {
	const url = browserTab().url;
	if (!url) return "Only Safari and Chromium-based Browsers are supported.";
	const obsiSurfingURL = "obsidian://web-open?url=" + encodeURIComponent(url);
	app.openLocation(obsiSurfingURL);
}
