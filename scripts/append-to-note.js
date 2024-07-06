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
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run(argv) {
	const vaultPath = $.getenv("vault_path");

	// PREPARE AND READ FILE
	let heading = "";
	let relativePath = $.getenv("relative_path");
	const toAppend = argv[0];

	const notePathHasHeading = /#[^ ][^/]*$/.test(relativePath);
	if (notePathHasHeading) {
		const tempArr = relativePath.split("#");
		heading = tempArr.pop() || "";
		relativePath = tempArr.join("");
	}

	let absolutePath = vaultPath + "/" + relativePath;
	if (absolutePath.slice(-3) !== ".md") absolutePath += ".md";
	if (!fileExists(absolutePath)) return "invalid"; // trigger error notification in Alfred

	const noteContent = readFile(absolutePath);

	//───────────────────────────────────────────────────────────────────────────
	// APPEND TO FILE

	if (!notePathHasHeading) {
		// only trim last line if it's a single blank
		// (in other cases, it might be deliberately left blank by the user)
		const trimmed = noteContent.replace(/([^\n])\n$/, "$1");
		writeToFile(absolutePath, trimmed + "\n" + toAppend);
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

	// guard: heading not found
	if (headingLineNo === -1) {
		app.displayNotification("", {
			withTitle: "Heading not found.",
			subtitle: "Appending to the bottom of the note instead.",
		});
		app.displayNotification("", {
			withTitle: "Heading not found.",
			subtitle: "Appending to the bottom of the note instead.",
		});
		writeToFile(absolutePath, noteContent + "\n" + toAppend);
		return relativePath; // return for opening function
	}

	// Appending at last non-empty line of heading-section
	let lastNonEmptyLineNo = -1;
	for (let i = headingLineNo + 1; i < lines.length; i++) {
		const line = lines[i];
		if (isHeading(line)) break;
		if (!isEmpty(line)) lastNonEmptyLineNo = i;
	}
	if (lastNonEmptyLineNo === -1) {
		ensureEmptyLineAt(lines, headingLineNo + 1);
		lines.splice(headingLineNo + 2, 0, toAppend);
		ensureEmptyLineAt(lines, headingLineNo + 3);
	} else {
		lines.splice(lastNonEmptyLineNo + 1, 0, toAppend);
	}
	const content = lines.join("\n");
	writeToFile(absolutePath, content);

	return relativePath; // return for opening function
}
