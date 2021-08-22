#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");

var current_vault = $.getenv("vault_path");
current_vault = current_vault.replace(/^~/, homepath);
const vault_list_path =	homepath + "/Library/Application Support/obsidian/obsidian.json";

var vault_list = app.doShellScript('cat "' + vault_list_path + '"');
vault_list = vault_list.replace(/.*path\":\"(.*?)\".*/gm, "$1");
vault_paths = vault_list.split("\r");

let jsonArray = [];
vault_paths.forEach((vault_path) => {
	let vault_name = vault_path.replace(/.*\//, "");
	let current = "";
	if (current_vault == vault_path) { current = "⭐️ ";	};
	let short_path = vault_path.replace (/\/Users\/[^\/]*/,"~");

	jsonArray.push({
		title: current + vault_name,
		subtitle: short_path,
		arg: vault_path,
	});
});

JSON.stringify({ items: jsonArray });
