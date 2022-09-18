#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
const alfredMatcher = (str) => str.replace (/[-()_.]/g, " ") + " " + str + " ";

function readFile (path, encoding) {
	if (!encoding) encoding = $.NSUTF8StringEncoding;
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, encoding);
	return ObjC.unwrap(str);
}

function parentFolder (filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1)
		.join("/");
}

//------------------------------------------------------------------------------

const vaultPath = $.getenv("vault_path").replace(/^~/, app.pathTo("home folder"));
const attachmentMetadata = vaultPath + "/.obsidian/plugins/metadata-extractor/allExceptMd.json";

// filter the metadataJSON for the items w/ relativePaths of starred files
const attachmentArr = JSON.parse(readFile(attachmentMetadata))
	.nonMdFiles
	.map(file => {
		const filename = file.name;
		const ext = file.name.split(".").pop();
		const relativePath = file.relativePath;
		const absolutePath = vaultPath + "/" + relativePath;

		let emoji = "";
		switch (ext) {
			case "jpg":
			case "jpeg":
			case "png":
			case "tiff":
				emoji = "🏞";
				break;
			case "pdf":
				emoji = "📕";
				break;
			case "wav":
			case "mp3":
				emoji = "🎙";
				break;
			case "mov":
			case "mp4":
				emoji = "🎞";
				break;
			case "js":
			case "ts":
			case "css":
				emoji = "🧑‍💻";
				break;
			case "csv":
			case "xlsx":
				emoji = "📊";
				break;
			case "pptx":
				emoji = "📙";
				break;
			case "docx":
				emoji = "📘";
				break;
			default:
				emoji = "📎";
		}

		return {
			"title": `${emoji} ${filename}`,
			"match": alfredMatcher(filename),
			"subtitle": "▸ " + parentFolder(relativePath),
			"arg": relativePath,
			"quicklookurl": vaultPath + "/" + relativePath,
			"type": "file:skipcheck",
			"uid": relativePath,
			"mods": { "fn": { "arg": absolutePath } },
		};

	});

JSON.stringify({ items: attachmentArr });
