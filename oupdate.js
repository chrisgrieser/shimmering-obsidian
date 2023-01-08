#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

function getVaultNameEncoded() {
	const _app = Application.currentApplication();
	_app.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const _vaultPath = ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
	return encodeURIComponent(_vaultPath.replace(/.*\//, ""));
}
const vaultNameEnc = getVaultNameEncoded();

app.openLocation(
	`obsidian://advanced-uri?vault=${vaultNameEnc}&commandid=obsidian42-brat%253ABRAT-checkForUpdatesAndUpdate`,
);
app.openLocation(`obsidian://advanced-uri?vault=${vaultNameEnc}&updateplugins=true`);
