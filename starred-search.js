#!/usr/bin/env osascript -l JavaScript

//Basic
ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");

//vault path
var vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const vaultPathLength = vault_path.length + 1;

//input
var starred = app.doShellScript(
	'grep "path" "' + vault_path + '/.obsidian/starred.json' +
	'" | cut -d ' + "'" + '"' + "'" +' -f 4'
).split("\r");

//JSON Construction
let jsonArray = [];
starred.forEach(starPath => {
	let absolutePath = vault_path + "/" + starPath;

	// filename extraction
	let filename = absolutePath.replace(/.*\/(.*?)$/, "$1");
	let type = absolutePath.replace(/.*\/.*?(\.\w+)?$/, "$1");
	let relativeLocation = absolutePath.substring(
		vaultPathLength,
		absolutePath.length - filename.length - 1
	);
	let relativePath = absolutePath.substring(vaultPathLength,absolutePath.length);
	relativePath = relativePath.replace (/\..+$/g,"");

	//matching for Alfred
	let AlfredMatcher = filename.replace (/\-|\(|\)|\./g," ");

	//icon & type dependent actions
	let iconpath = "";
	let folder_subtitle_addition = "";
	let hooking_subtitle = "⌃: Copy Hook";
	let new_pane_subtitle = "⌘: Open in new Pane";
	let appending_md_subtitle = "⛔️ Cannot append: Not a markdown file.";
	if (type == ".md") {
		iconpath = "note.png";
		appending_md_subtitle = "fn: Append clipboard content";
	} else if (type == ".png" || type == ".jpg") {
		iconpath = "image.png";
	} else if (type == ".pdf") {
		iconpath = "pdf.png";
	} else if (type == ".csv") {
		iconpath = "csv.png";
	}

	//push result
	jsonArray.push({
		title: "⭐️ " + filename,
		match: filename + " " + AlfredMatcher,
		subtitle: "▸ " + relativeLocation + folder_subtitle_addition,
		arg: absolutePath,
 		type: "file:skipcheck",
		uid: absolutePath,
		icon: { path: iconpath },
		mods: {
			fn: {
				valid: type == ".md",
				subtitle: appending_md_subtitle,
			},
			cmd: {
				arg: relativePath,
				subtitle: new_pane_subtitle,
			},
			ctrl: {
				subtitle: hooking_subtitle,
			},
		},
	});
});

JSON.stringify({ items: jsonArray });
