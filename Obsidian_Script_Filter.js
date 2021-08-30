#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");

//vault path
var vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const vaultPathLength = vault_path.length + 1;

//either searches the vault, or a subfolder of the vault
try {
	var pathToCheck = $.getenv("browse_folder");
} catch (error) {
	var pathToCheck = vault_path;
}

// Input
var attachm_subf = "";
if ($.getenv("search_ignore_attachments") == "true"){
	// get name of attachment subfolder from Obsidian settings
	attachm_subf = app.doShellScript('grep "attachmentFolderPath" "' + vault_path + '""/.obsidian/app.json" | cut -c 30- | sed "s/..$//"');
	// build the parameters that are to be added in the doshellscript below
	attachm_subf = "-not -path '*/" + attachm_subf + "*' ";
}

var file_array = app.doShellScript(
	'find "' +	pathToCheck + '" ' +
	" -not -path '*/.obsidian*' -not -path '*/.trash*' -not -path '*.DS_Store*' -not -path '*Icon?' " + attachm_subf +
	'| grep -Fxv "' +	pathToCheck + '"'
).split("\r");

var starred = app.doShellScript(
	'grep "path" "' + vault_path + '/.obsidian/starred.json' +
	'" | cut -d ' + "'" + '"' + "'" +' -f 4'
);

//JSON Construction
let jsonArray = [];
file_array.forEach(absolutePath => {
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
	let hooking_folder_subtitle = "⌃: Copy Hook";
	let new_pane_subtitle = "⌘: Open in new Pane";
	let dual_mode_subtitle = "⇧: Open in Dual Mode";
	let appending_md_subtitle = "⛔️ Cannot append: Not a Markdown File.";
	if (type == ".md") {
		iconpath = "note.png";
		appending_md_subtitle = "fn: Append clipboard content";
	} else if (type == ".png" || type == ".jpg") {
		iconpath = "image.png";
	} else if (type == ".pdf") {
		iconpath = "pdf.png";
	} else if (type == ".csv") {
		iconpath = "csv.png";
	} else if (type == "") {
		iconpath = "folder.png";
		folder_subtitle_addition = "     (↵: Browse)";
		hooking_folder_subtitle = "⛔️ Obsidian does not support linking to folders.";
		new_pane_subtitle, new_pane_subtitle = "⛔️ Obsidian does not support opening folders.";
	}

	//add starred icon
	let starred_icon = "";
	if (starred.includes(relativePath + ".")){
		starred_icon = "⭐️ "
	}

	//push result
	jsonArray.push({
		title: starred_icon + filename,
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
				valid: type !== "",
				arg: relativePath,
				subtitle: new_pane_subtitle,
			},
			ctrl: {
				valid: type !== "",
				subtitle: hooking_folder_subtitle,
			},
			shift: {
				valid: type == ".md",
				subtitle: dual_mode_subtitle,
			},
		},
	});
});

//new file in Folder
if (pathToCheck != vault_path){
	let currentFolder = pathToCheck.substring(vaultPathLength, pathToCheck.length);
	jsonArray.push({
		title: "Create new Note in here",
		subtitle: "▸ " + currentFolder,
		arg: "new",
		icon: { path: "new.png" },
	});
}

JSON.stringify({ items: jsonArray });
