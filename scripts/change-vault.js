#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;

const homepath = app.pathTo("home folder");
const current_vault = $.getenv("vault_path").replace(/^~/, homepath);
const vault_list_json = homepath + "/Library/Application Support/obsidian/obsidian.json";
const vault_list = app.doShellScript('cat "' + vault_list_json + '"').match(/\"path\":\"(.*?)\"/g);


let jsonArray = [];
vault_list.forEach(vault_json => {
	let vault_path = vault_json.replace(/\"path\":\"(.*?)\"/,"$1");
	let vault_name = vault_path.replace(/.*\//, "");
	let current = "";
	if (current_vault == vault_path) { current = "✅ ";	}
	let short_path = vault_path.replace (/\/Users\/[^\/]*/,"~");

	jsonArray.push({
		title: current + vault_name,
		subtitle: short_path,
		arg: short_path,
	});
});

jsonArray.push({
	title: "Open Vault Menu",
	subtitle: "Create new vaults or open a folder as a vault.",
	arg: "obsidian://advanced-uri?commandid=app%253Aopen-vault",
	icon: {path: "icons/settings.png"},
});

JSON.stringify({ items: jsonArray });
