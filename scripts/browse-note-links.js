#!/usr/bin/env osascript -l JavaScript

function run (argv){

	ObjC.import("stdlib");
	ObjC.import("Foundation");
	app = Application.currentApplication();
	app.includeStandardAdditions = true;

	// Functions
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

	// Import Data
	const homepath = app.pathTo("home folder");
	const vault_path = $.getenv("vault_path").replace(/^~/, homepath);
	const metadataJSON = vault_path + "/.obsidian/plugins/metadata-extractor/metadata.json";
	const starredJSON = vault_path + "/.obsidian/starred.json";
	const recentJSON = vault_path + "/.obsidian/workspace";
	let jsonArray = [];

	// create input note JSON
	// Caveat: the try scope is needed for special characters,
	// but iconv can't handle emojis, while normal getenv can't handle special
	// characters. So a filename with special characters AND emojis
	// will not be handled properly.
	let input_path = "";
	try {
		input_path = app.doShellScript ("echo '" + $.getenv("input_path") + "' | iconv -f UTF-8-MAC -t MACROMAN");
	}	catch (error) {
		input_path = $.getenv("input_path");
	}

	const meta_JSON = JSON.parse(readFile(metadataJSON));
	const input_note_JSON =
		meta_JSON
		.filter(n => n.relativePath.includes(input_path))
		[0];

	// create list of links and backlinks and merge them
	let both_links_list = [];
	let link_list = [];
	let backlink_list = [];
	if (input_note_JSON.links) {
		link_list =
			input_note_JSON
			.links
			.filter(l => l.relativePath)
			.map(item => item.relativePath);
		both_links_list.push (...link_list);
	}
	if (input_note_JSON.backlinks) {
		backlink_list =
			input_note_JSON
			.backlinks
			.map(item => item.relativePath);
		both_links_list.push (...backlink_list);
	}
	both_links_list = [...new Set(both_links_list)]; //only unique items

	// get starred and recent files
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

	// get external links
	let external_link_list =
		readFile(vault_path + "/" + input_path)
		.match (/\[(?! ]).*?\]\(.*?\)/g); //prevents links in markdown tasks from matching
	if (external_link_list != null){
		external_link_list =	external_link_list.map (mdlink => [
		   mdlink.split("](")[0].slice(1),
		   mdlink.split("](")[1].slice(0,-1)
		]);
	} else {
		external_link_list = [];
	}

	//guard clause if no links of any sort (should only occur with "ol" command though)
	// -----------------------------
	if (both_links_list == null && external_link_list.length == 0){
		jsonArray.push({
			'title': "No links recognized in the file.",
			'subtitle': "Press [Esc] to abort."
		});
		return JSON.stringify({ items: jsonArray });
	}


	// create JSON for Script Filter
	// -----------------------------
	const file_array =
		meta_JSON
		.filter(item => both_links_list.includes(item.relativePath));

	file_array.forEach(file => {
		let filename = file.fileName;
		let relativePath = file.relativePath;

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

		// >> emojis dependent on link type
		let linkIcon = "";
		if (link_list.includes (relativePath)) linkIcon += "🔗 ";
		if (backlink_list.includes (relativePath)) linkIcon += "⬅️ ";

		jsonArray.push({
			'title': linkIcon + emoji + filename,
			'match': additionalMatcher + alfredMatcher(filename),
			'subtitle': "▸ " + parentFolder(relativePath),
	 		'type': "file:skipcheck",
			'uid': relativePath,
			'arg': relativePath,
			'icon': { 'path': iconpath },
			'mods': {
				'shift': {
					'valid': hasLinks,
					'subtitle': links_subtitle
				},
			},
		});
	});

	// add external Links to Script-Filter JSON
	external_link_list.forEach(link => {
		let title = link[0];
		let url = link[1];
		let invalidSubtitle = "⛔️ Cannot do that with external link.";

		jsonArray.push({
			'title': title,
			'match': "external " + alfredMatcher(title) + " " + url,
			'subtitle': url,
			'uid': url,
			'arg': url,
			'icon': { 'path': "icons/external_link.png" },
			'mods': {
				'shift': {
					'valid': false,
					'subtitle': invalidSubtitle,
				},
				'fn': {
					'valid': false,
					'subtitle': invalidSubtitle,
				},
				'cmd': {
					'valid': false,
					'subtitle': invalidSubtitle,
				},
				'ctrl': {
					'valid': false,
					'subtitle': invalidSubtitle,
				},
				'alt': {
					'subtitle': "⌥: Copy URL",
				},
			},
		});
	});


	return JSON.stringify({ items: jsonArray });
}
