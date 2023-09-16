#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

const alfredMatcher = (/** @type {string} */ str) => str.replace(/[-()_.]/g, " ") + " " + str + " ";

/** @param {string} path */
function readFile(path) {
	const fm = $.NSFileManager.defaultManager;
	const data = fm.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

/** @param {string} filePath */
function parentFolder(filePath) {
	if (!filePath.includes("/")) return "/";
	return filePath.split("/").slice(0, -1).join("/");
}

const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const vaultPath = $.getenv("vault_path");
	const configFolder = $.getenv("config_folder");
	const attachmentMetadata = `${vaultPath}/${configFolder}/plugins/metadata-extractor/allExceptMd.json`;

	//───────────────────────────────────────────────────────────────────────────
	// GUARD: metadata does not exist since user has not run `osetup`
	if (!fileExists(attachmentMetadata)) {
		return JSON.stringify({
			items: [
				{
					title: "⚠️ No vault metadata found.",
					subtitle: "Please run the Alfred command `osetup` first. This only has to be done once.",
					valid: false,
				},
			],
		});
	}

	//───────────────────────────────────────────────────────────────────────────

	// filter the metadataJSON for the items w/ relativePaths of starred files
	const attachmentArr = JSON.parse(readFile(attachmentMetadata)).nonMdFiles.map(
		(/** @type {{ name: string; relativePath: any; }} */ file) => {
			/* eslint-disable-line complexity */ const filename = file.name;
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
			if ($.getenv("remove_emojis") === "1") emoji = "";

			return {
				title: `${emoji} ${filename}`,
				match: alfredMatcher(filename),
				subtitle: "▸ " + parentFolder(relativePath),
				arg: absolutePath,
				quicklookurl: absolutePath,
				type: "file:skipcheck",
				uid: absolutePath,
				mods: {
					shift: { arg: relativePath },
					cmd: { arg: relativePath },
					alt: { arg: relativePath },
					ctrl: { arg: relativePath },
				},
			};
		},
	);

	return JSON.stringify({ items: attachmentArr });
}
