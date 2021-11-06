#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
app = Application.currentApplication();
app.includeStandardAdditions = true;

// > Functions
function parentFolder (filePath){
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0,-1).join("/");
}
function alfredMatcher (str){
	return str.replace (/[-\(\)_\.]/g," ") + " " + str;
}
const readFile = function (path, encoding) {
    !encoding && (encoding = $.NSUTF8StringEncoding);
    const fm = $.NSFileManager.defaultManager;
    const data = fm.contentsAtPath(path);
    const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
    return ObjC.unwrap(str);
};

const homepath = app.pathTo("home folder");
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const metadataJSON = vault_path + "/.obsidian/plugins/metadata-extractor/metadata.json";
const starredJSON = vault_path + "/.obsidian/starred.json";
const recentJSON = vault_path + "/.obsidian/workspace";
let jsonArray = [];

let starred_files = [];
if (readFile(starredJSON) != ""){
	starred_files = 
		JSON.parse(readFile(starredJSON))
		.items
		.filter (item => item.type == "file")
		.map (item => item.path);
}

const recent_files = 
	JSON.parse(readFile(recentJSON))
	 .lastOpenFiles;

//filter the metadataJSON for the items w/ relativePaths of starred files
const file_array = 
	JSON.parse(readFile(metadataJSON))
	.filter(item => recent_files.includes(item.relativePath));

//JSON Construction
file_array.forEach(file => {

	let filename = file.fileName;
	let relativePath = file.relativePath;

	//icon & type dependent actions
	let iconpath = "icons/note.png";
	let emoji = "🕑 ";
	let additionalMatcher = "";
	if (starred_files.includes(relativePath))	{
		emoji += "⭐️ ";
		additionalMatcher += "starred ";
	}
	if (filename.toLowerCase().includes("kanban"))	iconpath = "icons/kanban.png";
	if (filename.toLowerCase().includes("to do")) emoji += "☑️ ";
	if (filename.toLowerCase().includes("template")) emoji += "📄 ";
	if (filename.toLowerCase().includes("inbox")) emoji += "📥 ";
	if (filename.includes("MOC")) emoji += "🗺 ";
	if (filename.includes("MoC")) emoji += "🗺 ";

	// >> check link existence of file
	let hasLinks = false;
	let links_subtitle = "⛔️ Note without Outgoing Links or Backlinks";
	let links_existent = "⇧: Browse Links in Note";
	if (file.links) {
		if (file.links.some(l => l.relativePath)){
			hasLinks = true;
			links_subtitle = links_existent;
		}
	} else if (file.backlinks != null) {
		hasLinks = true;
		links_subtitle = links_existent;
	} else {
		let external_link_list =
			readFile(vault_path + "/" + relativePath)
			.match (/\[.*?\]\(.*?\)/); //no g-flag, since existence of 1 link sufficient
		if (external_link_list != null){
			hasLinks = true;
			links_subtitle = links_existent;
		}
	}

	//push result
	jsonArray.push({
		title: emoji + filename,
		match: additionalMatcher + alfredMatcher(filename),
		subtitle: "▸ " + parentFolder(relativePath),
		arg: relativePath,
 		type: "file:skipcheck",
		uid: relativePath,
		icon: { path: iconpath },
		mods: {
			shift: { 
				valid: hasLinks,
				subtitle: links_subtitle
			},
		},
	});
});


JSON.stringify({ items: jsonArray });


