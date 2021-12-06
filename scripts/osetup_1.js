#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
app = Application.currentApplication();
app.includeStandardAdditions = true;

function readFile (path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

// get vault paths
const vaultListJson = app.pathTo("home folder") + "/Library/Application Support/obsidian/obsidian.json";
const vaultList = JSON.parse(readFile(vaultListJson)).vaults;
const vaultArray = [];
for (const hash in vaultList) vaultArray.push(vaultList[hash].path);

const jsonArray = [];
vaultArray.forEach(vaultPath => {
	const vaultName = vaultPath.replace(/.*\//, "");
	const shortPath = vaultPath.replace (/\/Users\/[^/]*/, "~");
	let subtitle = "Control this vault with 'Shimmering Obsidian'";
	if (vaultArray.length === 1) subtitle = "Confirm with 'return' that this is your vault.";

	jsonArray.push({
		"title": vaultName,
		"subtitle": subtitle,
		"arg": vaultPath,
	});
});

JSON.stringify({ items: jsonArray });
