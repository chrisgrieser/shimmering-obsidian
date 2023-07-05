#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib")

function getVaultNameEncoded() {
	const theApp = Application.currentApplication();
	theApp.includeStandardAdditions = true;
	const dataFile = $.NSFileManager.defaultManager.contentsAtPath($.getenv("alfred_workflow_data") + "/vaultPath");
	const vault = $.NSString.alloc.initWithDataEncoding(dataFile, $.NSUTF8StringEncoding);
	const theVaultPath = ObjC.unwrap(vault)
	const vaultName = theVaultPath.replace(/.*\//, "")
	return encodeURIComponent(vaultName);
}

//──────────────────────────────────────────────────────────────────────────────

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
