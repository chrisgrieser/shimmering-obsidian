#!/usr/bin/env osascript -l JavaScript

ObjC.import("stdlib");
ObjC.import("Foundation");
const app = Application.currentApplication();
app.includeStandardAdditions = true;

//──────────────────────────────────────────────────────────────────────────────

/** @param {string} path */
function readFile(path) {
	const data = $.NSFileManager.defaultManager.contentsAtPath(path);
	const str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
	return ObjC.unwrap(str);
}

/**
 * @param {string} file
 * @param {string} text
 */
function writeToFile(file, text) {
	const str = $.NSString.alloc.initWithUTF8String(text);
	str.writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null);
}

const isHeading = (/** @type {string} */ line) => /^#+ /.test(line);
const isEmpty = (/** @type {string} */ line) => /^\s*$/.test(line);
const fileExists = (/** @type {string} */ filePath) => Application("Finder").exists(Path(filePath));

/**
 * @param {string[]} fileLines
 * @param {number} lineNo
 */
function ensureEmptyLineAt(fileLines, lineNo) {
	if (lineNo >= fileLines.length || !isEmpty(fileLines[lineNo])) {
		fileLines.splice(lineNo, 0, "");
	}
}

//──────────────────────────────────────────────────────────────────────────────
/** @type {AlfredRun} */
// rome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const vaultPath = $.getenv("vault_path");

	// PREPARE AND READ FILE
	let heading = "";
	let relativePath = $.getenv("relative_path");
	const toAppend = $.getenv("prefix") + argv[0];

	const noteHasHeading = /#[^ ][^/]*$/.test(relativePath);
	if (noteHasHeading) {
		const tempArr = relativePath.split("#");
		heading = tempArr.pop();
		relativePath = tempArr.join("");
	}

	let absolutePath = vaultPath + "/" + relativePath;
	if (absolutePath.slice(-3) !== ".md") absolutePath += ".md";
	if (!fileExists(absolutePath)) return "invalid"; // trigger error notification in Alfred

	const noteContent = readFile(absolutePath);

	//───────────────────────────────────────────────────────────────────────────
	// APPEND TO FILE

	if (!noteHasHeading) {
		writeToFile(absolutePath, noteContent + "\n" + toAppend);
		return relativePath; // return for opening function
	}

	// determine heading location to append to
	const lines = noteContent.split("\n");
	const headingLineNo = lines
		.map((line) => {
			const lineIsHeading = line.match(/^#+ /);
			if (lineIsHeading) return line.replace(/^#+ /gm, "");
			return ""; // ensures that a line with the same content as a heading isn't detected
		})
		.indexOf(heading);

	if (headingLineNo === -1) {
		console.log("Heading not found. Appending to the bottom of the note instead.");
		writeToFile(absolutePath, noteContent + "\n" + toAppend);
		return relativePath; // return for opening function
	}

	// Appending
	let lastNonEmptyLineNo = -1;
	for (let i = headingLineNo + 1; i < lines.length; i++) {
		const line = lines[i];
		if (isHeading(line)) break;
		else if (!isEmpty(line)) lastNonEmptyLineNo = i;
	}
	if (lastNonEmptyLineNo > 0) {
		lines.splice(lastNonEmptyLineNo + 1, 0, toAppend);
	} else {
		ensureEmptyLineAt(lines, headingLineNo + 1);
		lines.splice(headingLineNo + 2, 0, toAppend);
		ensureEmptyLineAt(lines, headingLineNo + 3);
	}
	const content = lines.join("\n") + "\n";
	writeToFile(absolutePath, content);

	return relativePath; // return for opening function
}
