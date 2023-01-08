#!/usr/bin/env osascript -l JavaScript
function getVaultNameEncoded() {
	const _app = Application.currentApplication();
	_app.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath("./vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const _vaultPath = ObjC.unwrap(vault).replace(/^~/, _app.pathTo("home folder"));
	return encodeURIComponent(_vaultPath.replace(/.*\//, ""));
}

// dump metadata files
const app = Application.currentApplication();
app.includeStandardAdditions = true;
const prefix = "obsidian://advanced-uri?vault=" + getVaultNameEncoded() + "&commandid=metadata-extractor%253A";
app.openLocation(prefix + "write-metadata-json");
delay(0.5);
app.openLocation(prefix + "write-tags-json");
delay(0.5);
app.openLocation(prefix + "write-allExceptMd-json");
delay(0.5);
app.openLocation(prefix + "write-canvas-json");
