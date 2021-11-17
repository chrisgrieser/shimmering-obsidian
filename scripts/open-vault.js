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

const homepath = app.pathTo("home folder");
const current_vault = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const vault_list_json = homepath + "/Library/Application Support/obsidian/obsidian.json";

// get vault paths
const vault_list = JSON.parse(readFile(vault_list_json)).vaults;
let vault_array = [];
for (var hash in vault_list) vault_array.push(vault_list[hash].path);

let jsonArray = [];
vault_array.forEach(vault_path => {
	let vault_name = vault_path.replace(/.*\//, "");
	let vault_URI = "obsidian://open?vault=" + encodeURIComponent(vault_name);

	//visual: icons & shorter path
	let currentIcon = "";
	if (current_vault == vault_path) currentIcon = "✅ ";
	let short_path = vault_path.replace (/\/Users\/[^\/]*/,"~");

	jsonArray.push({
		'title': currentIcon + vault_name,
		'subtitle': short_path,
		'arg': vault_URI,
		"mods": {
			"alt": {
				"arg": vault_path,
			},
			"cmd": {
				"arg": vault_path,
			},
			"shift": {
				"arg": vault_path,
			},
		}
	});
});

jsonArray.push({
	'title': "Vault Menu",
	'subtitle': "Create or delete vaults",
	'arg': "obsidian://advanced-uri?commandid=app%253Aopen-vault",
	'icon': {'path': "icons/settings.png"},
	"mods": {
		"alt": {
			"valid": false,
		},
		"cmd": {
			"valid": false,
		},
		"shift": {
			"valid": false,
		}
	}
});

JSON.stringify({ items: jsonArray });
