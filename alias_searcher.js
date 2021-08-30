#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");

const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const vaultPathLength = vault_path.length + 1;

// Input
let files = app.doShellScript(
	'find "' +	vault_path + '"'
	+ " -name '*.md' -not -path '*/.obsidian/*' -not -path '*/.trash/*' -not -path '*.DS_Store*' -not -path '*Icon?' | grep -Fxv '" + vault_path + "'"
);
var file_array = files.split("\r");

let jsonArray = [];
file_array.forEach(absolutePath => {

	// relative location extraction
	let filename = absolutePath.replace(/.*\/(.*?)$/, "$1");
	let relativeLocation = absolutePath.substring(
		vaultPathLength,
		absolutePath.length - filename.length - 1
	);
	let filename_without_ext = filename.substring (0, filename.length-3);
	let relativePath = absolutePath.substring(vaultPathLength,absolutePath.length);
	relativePath = relativePath.replace (/\..+$/g,"");

	let aliases = "";
	aliases = app.doShellScript(
		'if [[ `head -n 1 "' + absolutePath + '"` == "---" ]]; then ' +
		'sed -n "2,/---/p" "'+ absolutePath + '" ' +
			'| { grep -E "^aliases: " || true; } ' +
			'| cut -c 10- ' +
		';fi'
	);

	//push result, if there is an alias
	if (aliases != ""){
		jsonArray.push({
			title: aliases + "  ↪ " + filename_without_ext + "",
			match: aliases,
			subtitle: "▸ " + relativeLocation,
			arg: absolutePath,
			type: "file:skipcheck",
			mods: { cmd: {	arg: relativePath	}	},
			uid: absolutePath,
		});
	}
});

JSON.stringify({ items: jsonArray });
