#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import('Foundation');
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
const vault_list_json = app.pathTo("home folder") + "/Library/Application Support/obsidian/obsidian.json";
const vault_list = JSON.parse(readFile(vault_list_json)).vaults;
let vault_array = [];
for (var hash in vault_list) vault_array.push(vault_list[hash].path);

let jsonArray = [];
vault_array.forEach(vault_path => {
	let vault_name = vault_path.replace(/.*\//, "");
	let short_path = vault_path.replace (/\/Users\/[^\/]*/,"~");
	let subtitle = "Control this vault with 'Shimmering Obsidian'";
	if (vault_array.length == 1) subtitle = "Confirm with 'return' that this is your vault.";

	jsonArray.push({
		'title': vault_name,
		'subtitle': subtitle,
		'arg': vault_path,
	});
});

JSON.stringify({ items: jsonArray });
