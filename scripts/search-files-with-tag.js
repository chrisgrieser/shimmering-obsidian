#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import('Foundation');
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
const merge_nested_tags = $.getenv("merge_nested_tags") == "true" || false;
let jsonArray = [];

let starred_files = [];
if (readFile(starredJSON) != ""){
	starred_files = 
		JSON.parse(readFile(starredJSON))
		.items
		.filter (s => s.type == "file")
		.map (s => s.path);
}

const recent_files = 
	JSON.parse(readFile(recentJSON))
	.lastOpenFiles;

//filter the metadataJSON for the items w/ relativePaths of starred files
let selected_tag = app.doShellScript ("echo '" + $.getenv("selected_tag") + "' | iconv -f UTF-8-MAC -t MACROMAN");
if (merge_nested_tags) selected_tag = selected_tag.split("/")[0];

let file_array =
	JSON.parse(readFile(metadataJSON))
	.filter(j => j.tags);
if (merge_nested_tags) {
	file_array = file_array.filter(function (f){
		let hasParentTag = false;
		f.tags.forEach(tag => {
			if (tag.startsWith(selected_tag)) hasParentTag = true;
		});
		return hasParentTag;
	});
} else {
	file_array = file_array.filter(j => j.tags.includes(selected_tag));
}


file_array.forEach(file => {
	let filename = file.fileName;
	let relativePath = file.relativePath;

	// >> icon & emojis
	let iconpath = "icons/note.png";
	let emoji = "";
	let additionalMatcher = "";
	if (starred_files.includes(relativePath))	{
		emoji += "⭐️ ";
		additionalMatcher += "starred ";
	}
	if (recent_files.includes(relativePath)) {
		emoji += "🕑 ";
		additionalMatcher += "recent ";
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
