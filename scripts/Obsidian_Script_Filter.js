#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");

//vault path
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const vaultPathLength = vault_path.length + 1;

//either searches the vault, or a subfolder of the vault
try {
	var pathToCheck = $.getenv("browse_folder");
} catch (error) {
	var pathToCheck = vault_path;
}

// Input
var attachment_search = "";
if ($.getenv("search_ignore_attachments") == "true"){
	attachment_search = "-not -name '*.pdf' -not -name '*.jpg' -not -name '*.jpeg' -not -name '*.png' -not -name '*.gif' -not -name '*.mp4' -not -name '*.mov' ";
}

var file_array = app.doShellScript(
	'find "' +	pathToCheck + '" ' +
	" -not -path '*/.obsidian*' -not -path '*/.trash*' -not -name '*.DS_Store' -not -name '*Icon?' " +
	attachment_search +
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
	let hooking_folder_subtitle = "⌃: Copy Markdown Link";
	let new_pane_subtitle = "⌘: Open in New Pane";
	let dual_mode_subtitle = "⇧: Open in Dual Mode";
	let appending_md_subtitle = "⛔️ Cannot append: Not a Markdown File.";
	if (type == ".md") {
		iconpath = "note.png";
		appending_md_subtitle = "fn: Append clipboard content";
		if (filename.toLowerCase().includes("kanban")){
			iconpath = "kanban.png";
		}
	} else if (type == ".png" || type == ".jpg" || type == ".jpeg") {
		iconpath = "image.png";
		dual_mode_subtitle = "⛔️ Cannot Open Image in Dual Mode";
	} else if (type == ".pdf") {
		iconpath = "pdf.png";
		dual_mode_subtitle = "⛔️ Cannot Open PDF in Dual Mode";
	} else if (type == ".csv") {
		iconpath = "csv.png";
		dual_mode_subtitle = "⛔️ Cannot Open CSV in Dual Mode";
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

// Additional options when browsing a folder
if (pathToCheck != vault_path){
	//New File in Folder
	let currentFolder = pathToCheck.substring(vaultPathLength, pathToCheck.length);
	jsonArray.push({
		title: "Create new Note in here",
		subtitle: "▸ " + currentFolder,
		arg: "new",
		icon: { path: "new.png" },
	});
	//go up to parent folder
	let parentFolderAbs = pathToCheck.replace (/(.*)\/.*$/,"$1");
	let parentFolderRel = parentFolderAbs.substring(vaultPathLength, parentFolderAbs.length);
	if (parentFolderRel == "") parentFolderRel = "/";
	jsonArray.push({
		title: "⬆️ Browse the Parent Folder",
		subtitle: "▸ " + parentFolderRel,
		arg: parentFolderAbs,
		icon: { path: "folder.png" },
	});
}

JSON.stringify({ items: jsonArray });
