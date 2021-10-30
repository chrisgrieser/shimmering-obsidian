#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import('Foundation');
app = Application.currentApplication();
app.includeStandardAdditions = true;

// > Functions
const readFile = function (path, encoding) {
    !encoding && (encoding = $.NSUTF8StringEncoding);
    const fm = $.NSFileManager.defaultManager;
    const data = fm.contentsAtPath(path);
    const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
    return ObjC.unwrap(str);
};

function parentFolder (filePath){
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0,-1).join("/");
}
function alfredMatcher (str){
	return str.replace (/[-\(\)_\.]/g," ") + " " + str;
}

// > Import Data
const homepath = app.pathTo("home folder");
const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
const metadataJSON = vault_path + "/.obsidian/plugins/metadata-extractor/metadata.json";
const starredJSON = vault_path + "/.obsidian/starred.json";
const recentJSON = vault_path + "/.obsidian/workspace";

//either searches the vault, or a subfolder of the vault
let pathToCheck;
try  {
	currentFolder = $.getenv("browse_folder");
	pathToCheck = vault_path + "/" + currentFolder;
	if (pathToCheck.endsWith("//")) pathToCheck = vault_path; // when going back up from child of vault root
} catch (error) {
	pathToCheck = vault_path;
}


var folder_array =
	app.doShellScript('find "' + pathToCheck + '" -type d -mindepth 1 -not -path "*/\.*"')
	.split("\r");
if (folder_array == "") folder_array = [];

let file_array = JSON.parse (readFile(metadataJSON));

if (pathToCheck != vault_path) {
	file_array = JSON.parse (readFile(metadataJSON))
		.filter(f => f.relativePath.startsWith (currentFolder));
}

var starred_files = [];
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


const h_lvl_ignore = $.getenv("h_lvl_ignore");
let heading_ignore = [true];
for (i = 1; i < 7; i++) {
	if (h_lvl_ignore.includes (i.toString())) heading_ignore.push (true);
	else heading_ignore.push (false);
}

let jsonArray = [];

// > Push files
file_array.forEach(file => {
	let filename = file.fileName;
	let relativePath = file.relativePath;

	let tagMatcher = "";
	if (file.tags) tagMatcher = " #" + file.tags.join(" #");

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

	// >> Notes (file names)
	jsonArray.push({
		'title': emoji + filename,
		'match': alfredMatcher(filename) + tagMatcher + " filename name title",
		'subtitle': "▸ " + parentFolder(relativePath),
		'arg': relativePath,
 		'type': "file:skipcheck",
		'uid': relativePath,
		'icon': { 'path': iconpath },
		'mods': {
			'shift': {
				'valid': hasLinks,
				'subtitle': links_subtitle
			}
		}
	});

	// >> Aliases
	if (file.aliases != undefined){
		file.aliases.forEach(alias => {
			jsonArray.push({
				'title': alias,
				'match': additionalMatcher + "alias " + alfredMatcher(alias),
				'subtitle': "↪ " + filename,
				'arg': relativePath,
				'type': "file:skipcheck",
				'uid': alias + "_" + relativePath,
				'icon': { 'path': "icons/alias.png" },
				'mods': {
					'shift': {
						'valid': hasLinks,
						'subtitle': links_subtitle
					}
				}
			});
		});
	}

	// >> Headings
	if (!file.headings) return; //skips iteration if no heading
	file.headings.forEach(heading => {
		let hName = heading.heading;
		let lvl = heading.level;
		if (heading_ignore[lvl]) return; // skips iteration if heading has been configured as ignore
		iconpath = "icons/headings/h" + lvl.toString() + ".png";
		let matchStr =
			"h" + lvl.toString() + " " +
			alfredMatcher(hName) + " ";

		jsonArray.push({
			'title': hName,
			'match': matchStr,
			'subtitle': "➣ " + filename,
			'arg': relativePath + "#" + hName,
	 		'type': "file:skipcheck",
			'uid': hName + "_" + relativePath,
			'icon': { 'path': iconpath },
			'mods': {
				'shift': {
					'valid': hasLinks,
					'subtitle': links_subtitle,
					'arg': relativePath
				},
				'alt': {
					'arg': relativePath
				}
			}
		});
	});
});

folder_array.forEach(absolutePath => {
	let name = absolutePath.split("/").pop();
	let relativePath = absolutePath.slice(vault_path.length + 1);

	jsonArray.push({
		'title': name,
		'match': alfredMatcher(name) + " folder",
		'subtitle': "▸ " + parentFolder(relativePath) + "   [↵: Browse]",
		'arg': relativePath,
 		'type': "file:skipcheck",
		'uid': relativePath,
		'icon': { 'path': "icons/folder.png" },
		'mods': {
			'cmd': {
				'valid': false,
				'subtitle': "⛔️ Cannot open folders",
			},
			'shift': {
				'valid': false,
				'subtitle': "⛔️ Folders have no links.",
			},
			'ctrl': {
				'valid': false,
				'subtitle': "⛔️ Linking not possible for folders",
			},
			'fn': {
				'valid': false,
				'subtitle': "⛔️ Cannot append to folders.",
			}
		}
	});
});

//Additional options when browsing a folder
if (pathToCheck != vault_path){

	//New File in Folder
	jsonArray.push({
		'title': "Create new Note in here",
		'subtitle': "▸ " + currentFolder,
		'arg': "new",
		'icon': { 'path': "icons/new.png" },
	});

	//go up to parent folder
	jsonArray.push({
		'title': "⬆️ Up to Parent Folder",
		'match': "up back parent folder directory browse .. cd",
		'subtitle': "▸ " + parentFolder(currentFolder),
		'arg': parentFolder(currentFolder),
		'icon': { 'path': "icons/folder.png" },
	});
}

JSON.stringify({ items: jsonArray });
