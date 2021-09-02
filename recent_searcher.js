#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;
const homepath = app.pathTo("home folder");

//vault path
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const vaultPathLength = vault_path.length + 1;

//get recent files
var recent_files = app.doShellScript(
	"grep -A 10 'lastOpenFiles' '" + vault_path + '/.obsidian/workspace' + "' | tail -n 10 | cut -d '" + '"' + "' -f 2"
).split("\r");


//JSON Construction
let jsonArray = [];
recent_files.forEach(relativePath => {

	//ensure file's existence (deleted fiels are also listed there)
	let absolutePath = vault_path + "/" + relativePath;
	fileExists = app.doShellScript(
		'test -f "' + absolutePath + '" && echo "true" || echo "false"'
	);
	
	if (fileExists == "true"){
		// filename extraction
		let filename = absolutePath.replace(/.*\/(.*?)$/, "$1");
		let type = absolutePath.replace(/.*\/.*?(\.\w+)?$/, "$1");
		let relativeLocation = absolutePath.substring(
			vaultPathLength,
			absolutePath.length - filename.length - 1
		);
	
		//matching for Alfred
		let AlfredMatcher = filename.replace (/\-|\(|\)|\./g," ");
	
		//icon & type dependent actions
		let iconpath = "";
		let new_pane_subtitle = "⌘: Open in new Pane";
		let dual_mode_subtitle = "⇧: Open in Dual Mode";
		let appending_md_subtitle = "⛔️ Cannot append: Not a markdown file";
		if (type == ".md") {
			iconpath = "note.png";
			appending_md_subtitle = "fn: Append clipboard content";
		} else if (type == ".png" || type == ".jpg" || type == ".jpeg") {
			iconpath = "image.png";
			dual_mode_subtitle = "⛔️ Cannot Open Image in Dual Mode";
		} else if (type == ".pdf") {
			iconpath = "pdf.png";
			dual_mode_subtitle = "⛔️ Cannot Open PDF in Dual Mode";
		} else if (type == ".csv") {
			iconpath = "csv.png";
			dual_mode_subtitle = "⛔️ Cannot Open CSV in Dual Mode";
		}
	
		//push result
		jsonArray.push({
			title: "🕗 " + filename,
			match: filename + " " + AlfredMatcher,
			subtitle: "▸ " + relativeLocation,
			arg: absolutePath,
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
				shift: {
					valid: type == ".md",
					subtitle: dual_mode_subtitle,
				},
			},
	 		type: "file:skipcheck",
			uid: absolutePath,
		});
	}
	
});

JSON.stringify({ items: jsonArray });


