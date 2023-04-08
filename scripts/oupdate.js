#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function getVaultNameEncoded() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const theVaultPath = ObjC.unwrap(vault)
	const vaultName = theVaultPath.replace(/.*\//, "")
	return encodeURIComponent(vaultName);
}
const vaultNameEnc = getVaultNameEncoded();

app.openLocation(
	`obsidian://advanced-uri?vault=${vaultNameEnc}&commandid=obsidian42-brat%253ABRAT-checkForUpdatesAndUpdate`,
);
app.openLocation(`obsidian://advanced-uri?vault=${vaultNameEnc}&updateplugins=true`);
